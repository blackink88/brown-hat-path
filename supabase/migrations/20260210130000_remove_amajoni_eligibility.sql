-- Remove "Amajoni Eligibility" from Professional tier features (pricing page).

UPDATE public.subscription_tiers
SET features = (
  SELECT coalesce(jsonb_agg(to_jsonb(elem)), '[]'::jsonb)
  FROM jsonb_array_elements_text(features) AS elem
  WHERE elem <> 'Amajoni Eligibility'
)
WHERE name = 'Professional';
