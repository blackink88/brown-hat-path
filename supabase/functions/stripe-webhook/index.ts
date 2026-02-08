import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!sig || !webhookSecret) {
    console.error("Missing stripe-signature or STRIPE_WEBHOOK_SECRET");
    return new Response("Bad request", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.client_reference_id ?? (session.metadata?.user_id as string | undefined);
  const tierId = session.metadata?.tier_id as string | undefined;

  if (!userId || !tierId) {
    console.error("Missing user_id or tier_id in session metadata");
    return new Response("Bad payload", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Cancel any currently active subscriptions for this user
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("user_id", userId)
    .eq("status", "active");

  // Resubscribe: if user already has a row (e.g. cancelled), reactivate it; otherwise insert
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        tier_id: tierId,
        status: "active",
        starts_at: new Date().toISOString(),
        ends_at: null,
      })
      .eq("id", existing.id);
    if (error) {
      console.error("Subscription reactivate failed:", error);
      return new Response("Database error", { status: 500 });
    }
  } else {
    const { error } = await supabase.from("subscriptions").insert({
      user_id: userId,
      tier_id: tierId,
      status: "active",
      starts_at: new Date().toISOString(),
    });
    if (error) {
      console.error("Subscription insert failed:", error);
      return new Response("Database error", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
