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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Handle checkout completed: create/update subscription and store Stripe ids
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id ?? (session.metadata?.user_id as string | undefined);
    const tierId = session.metadata?.tier_id as string | undefined;
    const customerId = typeof session.customer === "string" ? session.customer : null;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

    if (!userId || !tierId) {
      console.error("Missing user_id or tier_id in session metadata");
      return new Response("Bad payload", { status: 400 });
    }

    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", userId)
      .eq("status", "active");

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let currentPeriodEnd: string | null = null;
    if (subscriptionId) {
      try {
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
          apiVersion: "2023-10-16",
          httpClient: Stripe.createFetchHttpClient(),
        });
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        if (sub.current_period_end) {
          currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
        }
      } catch (e) {
        console.error("Failed to fetch subscription for current_period_end:", e);
      }
    }

    const stripeFields = {
      ...(customerId && { stripe_customer_id: customerId }),
      ...(subscriptionId && { stripe_subscription_id: subscriptionId }),
      ...(currentPeriodEnd && { current_period_end: currentPeriodEnd }),
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          tier_id: tierId,
          status: "active",
          starts_at: new Date().toISOString(),
          ends_at: null,
          ...stripeFields,
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
        ...stripeFields,
      });
      if (error) {
        console.error("Subscription insert failed:", error);
        return new Response("Database error", { status: 500 });
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // When subscription changes in Stripe (Portal or API), sync our DB
  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const subId = subscription.id;
    const isCanceled = subscription.status === "canceled" || subscription.cancel_at_period_end === true;
    const currentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null;

    if (event.type === "customer.subscription.deleted" || isCanceled) {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          ends_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subId);
      if (error) console.error("Subscription sync cancel failed:", error);
    } else {
      const { error } = await supabase
        .from("subscriptions")
        .update({ current_period_end: currentPeriodEnd })
        .eq("stripe_subscription_id", subId);
      if (error) console.error("Subscription sync period end failed:", error);
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
