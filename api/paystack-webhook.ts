/**
 * Paystack Webhook Handler — Vercel Edge Function
 * ─────────────────────────────────────────────────
 * Endpoint: POST /api/paystack-webhook
 *
 * Register this URL in Paystack Dashboard → Settings → API Keys & Webhooks:
 *   https://brownhat.academy/api/paystack-webhook
 *
 * Required Vercel env var:
 *   PAYSTACK_SECRET_KEY   sk_live_... (your Paystack secret key)
 *
 * Events handled:
 *   charge.success        — subscription renewal payment succeeded → extend end_date
 *   subscription.disable  — subscription cancelled → mark Cancelled in Frappe
 *   invoice.payment_failed — payment failed → mark Cancelled in Frappe
 */

export const config = { runtime: "edge" };

const FRAPPE_URL        = process.env.FRAPPE_URL        ?? "https://lms-dzr-tbs.c.frappe.cloud";
const FRAPPE_API_KEY    = process.env.FRAPPE_API_KEY    ?? "";
const FRAPPE_API_SECRET = process.env.FRAPPE_API_SECRET ?? "";
const PAYSTACK_SECRET   = process.env.PAYSTACK_SECRET_KEY ?? "";

// ── Verify Paystack HMAC-SHA512 signature ─────────────────────────────────────

async function verifySignature(body: string, signature: string): Promise<boolean> {
  if (!PAYSTACK_SECRET || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(PAYSTACK_SECRET),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig    = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === signature;
}

// ── Frappe helpers ─────────────────────────────────────────────────────────────

function adminHeader() {
  return `token ${FRAPPE_API_KEY}:${FRAPPE_API_SECRET}`;
}

async function frappeDocGet(
  doctype: string,
  filters: unknown[][],
  fields: string[] = ["name"],
  limit = 5,
) {
  const url = new URL(`${FRAPPE_URL}/api/resource/${encodeURIComponent(doctype)}`);
  url.searchParams.set("filters", JSON.stringify(filters));
  url.searchParams.set("fields",  JSON.stringify(fields));
  url.searchParams.set("limit",   String(limit));
  const res  = await fetch(url.toString(), {
    headers: { Authorization: adminHeader(), Accept: "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

async function frappeDocPut(doctype: string, name: string, doc: Record<string, unknown>) {
  const res = await fetch(
    `${FRAPPE_URL}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      headers: {
        Authorization: adminHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(doc),
    },
  );
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

// ── Find BH Subscription by Paystack subscription code ────────────────────────

async function findSubscription(subscriptionCode: string) {
  const result = await frappeDocGet(
    "BH Subscription",
    [["paystack_subscription_code", "=", subscriptionCode]],
    ["name", "member", "tier", "status", "end_date"],
    1,
  );
  return (result.data?.data ?? [])[0] ?? null;
}

// ── Find BH Subscription by member email (most recent active) ─────────────────

async function findSubscriptionByEmail(email: string) {
  const result = await frappeDocGet(
    "BH Subscription",
    [["member", "=", email], ["status", "=", "Active"]],
    ["name", "member", "tier", "status", "end_date", "paystack_subscription_code"],
    1,
  );
  return (result.data?.data ?? [])[0] ?? null;
}

// ── Extend subscription end_date by one month ─────────────────────────────────

function addOneMonth(dateStr: string): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().substring(0, 10);
}

// ── Main handler ───────────────────────────────────────────────────────────────

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body      = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  // Verify the request is genuinely from Paystack
  const valid = await verifySignature(body, signature);
  if (!valid) {
    console.error("Paystack webhook: invalid signature");
    return new Response("Unauthorized", { status: 401 });
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const { event: eventType, data } = event;

  console.log(`Paystack webhook: ${eventType}`);

  try {

    // ── charge.success ─────────────────────────────────────────────────────────
    // Fired when any charge succeeds. For subscriptions, data.plan will be set.
    if (eventType === "charge.success") {
      const plan             = data.plan as Record<string, unknown> | undefined;
      const subscriptionCode = (data.subscription_code as string) ?? "";
      const customerEmail    = ((data.customer as Record<string, unknown>)?.email as string) ?? "";

      // Only handle subscription charges (plan code present)
      if (!plan?.plan_code) {
        return new Response(JSON.stringify({ received: true, skipped: "not a subscription charge" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Find the BH Subscription record
      let sub = subscriptionCode ? await findSubscription(subscriptionCode) : null;
      if (!sub && customerEmail) sub = await findSubscriptionByEmail(customerEmail);

      if (sub) {
        const newEndDate = addOneMonth(sub.end_date ?? new Date().toISOString().substring(0, 10));
        await frappeDocPut("BH Subscription", sub.name as string, {
          status:   "Active",
          end_date: newEndDate,
          // Store subscription code if we didn't have it before
          ...(subscriptionCode && !sub.paystack_subscription_code
            ? { paystack_subscription_code: subscriptionCode }
            : {}),
        });
        console.log(`Renewed subscription ${sub.name} → end_date: ${newEndDate}`);
      } else {
        console.warn(`charge.success: no BH Subscription found for ${subscriptionCode || customerEmail}`);
      }
    }

    // ── subscription.disable ───────────────────────────────────────────────────
    // Fired when a subscription is cancelled (by customer or failed payments).
    if (eventType === "subscription.disable") {
      const subscriptionCode = (data.subscription_code as string) ?? "";
      const customerEmail    = ((data.customer as Record<string, unknown>)?.email as string) ?? "";

      let sub = subscriptionCode ? await findSubscription(subscriptionCode) : null;
      if (!sub && customerEmail) sub = await findSubscriptionByEmail(customerEmail);

      if (sub) {
        await frappeDocPut("BH Subscription", sub.name as string, { status: "Cancelled" });
        console.log(`Cancelled subscription ${sub.name}`);
      } else {
        console.warn(`subscription.disable: no BH Subscription found for ${subscriptionCode || customerEmail}`);
      }
    }

    // ── invoice.payment_failed ─────────────────────────────────────────────────
    // Fired when a subscription renewal payment fails.
    if (eventType === "invoice.payment_failed") {
      const subscriptionCode = ((data.subscription as Record<string, unknown>)?.subscription_code as string) ?? "";
      const customerEmail    = ((data.customer as Record<string, unknown>)?.email as string) ?? "";

      let sub = subscriptionCode ? await findSubscription(subscriptionCode) : null;
      if (!sub && customerEmail) sub = await findSubscriptionByEmail(customerEmail);

      if (sub) {
        await frappeDocPut("BH Subscription", sub.name as string, { status: "Cancelled" });
        console.log(`Payment failed — cancelled subscription ${sub.name}`);
      }
    }

  } catch (err) {
    console.error("Paystack webhook error:", err);
    // Still return 200 so Paystack doesn't keep retrying
    return new Response(
      JSON.stringify({ received: true, error: err instanceof Error ? err.message : "unknown" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
