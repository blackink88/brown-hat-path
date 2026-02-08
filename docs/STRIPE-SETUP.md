# Stripe payment setup

Subscription checkout uses Stripe. Configure the following.

## 1. Stripe Dashboard

1. Create a Stripe account and get your **Secret key** (Dashboard → Developers → API keys).
2. For each tier (Foundation, Practitioner, Professional), create a **Product** and a **Price**:
   - Product: e.g. "Brown Hat Foundation"
   - Price: Recurring monthly, amount in ZAR (49900 = R499, 150000 = R1,500, 300000 = R3,000).
3. Copy each Price ID (e.g. `price_xxx`) — you will add these to the database.

## 2. Database

Set `stripe_price_id` on each row in `subscription_tiers`:

```sql
UPDATE public.subscription_tiers SET stripe_price_id = 'price_xxx' WHERE name = 'Foundation';
UPDATE public.subscription_tiers SET stripe_price_id = 'price_xxx' WHERE name = 'Practitioner';
UPDATE public.subscription_tiers SET stripe_price_id = 'price_xxx' WHERE name = 'Professional';
```

## 3. Supabase secrets (Edge Functions)

Set these in Supabase Dashboard → Project Settings → Edge Functions → Secrets (or via CLI):

- `STRIPE_SECRET_KEY` — your Stripe secret key.
- `STRIPE_WEBHOOK_SECRET` — from Stripe Dashboard → Developers → Webhooks: add endpoint `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`, select event `checkout.session.completed`, then copy the signing secret.

## 4. Deploy Edge Functions

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

## 5. Flow

- **Pricing page**: Logged-in user clicks "Subscribe" → frontend calls `create-checkout-session` with `tier_id` → redirects to Stripe Checkout.
- **After payment**: Stripe redirects to `/dashboard?subscription=success` and sends `checkout.session.completed` to the webhook. The webhook sets any existing active subscription to `cancelled` and inserts a new `subscriptions` row so the user gets access.

## 6. New users and access

- New signups get **no subscription** (migration `20260209100000_paid_access_and_stripe.sql`). They must choose a tier on the Pricing page and complete payment to access tier-gated lessons.
- Lesson access is enforced by RLS: `get_user_tier_level(auth.uid())` must be ≥ the course’s `required_tier_level`.
