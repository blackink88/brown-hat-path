#!/usr/bin/env python3
"""
backfill_subscriptions.py — Create missing BH Subscription records from Paystack

Fetches all successful Paystack transactions, matches them to users in Frappe,
and creates BH Subscription records for anyone who paid but has no active record.

Usage:
  PAYSTACK_SECRET_KEY=sk_live_xxx python3 scripts/backfill_subscriptions.py
  PAYSTACK_SECRET_KEY=sk_live_xxx python3 scripts/backfill_subscriptions.py --dry-run
"""

import os, sys, json, urllib.parse, urllib.request, urllib.error
from datetime import datetime, timedelta

PAYSTACK_SECRET   = os.environ.get("PAYSTACK_SECRET_KEY", "")
FRAPPE_URL        = os.environ.get("FRAPPE_URL",        "https://lms-dzr-tbs.c.frappe.cloud")
FRAPPE_API_KEY    = os.environ.get("FRAPPE_API_KEY",    "c051ee2f244a78a")
FRAPPE_API_SECRET = os.environ.get("FRAPPE_API_SECRET", "0ef76927d6e142d")

DRY_RUN = "--dry-run" in sys.argv

if not PAYSTACK_SECRET:
    print("ERROR: Set PAYSTACK_SECRET_KEY environment variable")
    print("  export PAYSTACK_SECRET_KEY=sk_live_...")
    sys.exit(1)


# ── HTTP helpers ────────────────────────────────────────────────────────────────

def frappe_headers():
    return {
        "Authorization": f"token {FRAPPE_API_KEY}:{FRAPPE_API_SECRET}",
        "Content-Type":  "application/json",
        "Accept":        "application/json",
    }

def paystack_headers():
    return {
        "Authorization": f"Bearer {PAYSTACK_SECRET}",
        "Accept":        "application/json",
    }

def http_get(url, headers):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read()), r.status
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:400]
        print(f"  HTTP {e.code}: {body}")
        return {}, e.code

def http_post(url, headers, data):
    if DRY_RUN:
        print(f"  [DRY-RUN] POST {url}: {json.dumps(data)[:120]}")
        return {"data": {"name": "dry-run"}}, 200
    body = json.dumps(data).encode()
    req  = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read()), r.status
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:600]
        print(f"  HTTP {e.code}: {body}")
        return {}, e.code


# ── Paystack helpers ────────────────────────────────────────────────────────────

def paystack_list_transactions(page=1, per_page=100):
    import subprocess
    url = f"https://api.paystack.co/transaction?status=success&perPage={per_page}&page={page}"
    result = subprocess.run(
        ["curl", "-s", url,
         "-H", f"Authorization: Bearer {PAYSTACK_SECRET}",
         "-H", "Accept: application/json"],
        capture_output=True, text=True, timeout=30,
    )
    try:
        data = json.loads(result.stdout)
    except Exception:
        print(f"  ERROR parsing Paystack response: {result.stdout[:200]}")
        data = {}
    return data.get("data", []), data.get("meta", {})

def paystack_all_successful_transactions():
    """Fetch every successful transaction across all pages."""
    all_txns = []
    page = 1
    while True:
        txns, meta = paystack_list_transactions(page=page, per_page=100)
        if not txns:
            break
        all_txns.extend(txns)
        total = meta.get("total", 0)
        if len(all_txns) >= total:
            break
        page += 1
    return all_txns


# ── Frappe helpers ──────────────────────────────────────────────────────────────

def frappe_get_list(doctype, filters, fields, limit=50):
    url = f"{FRAPPE_URL}/api/resource/{urllib.parse.quote(doctype)}"
    qs  = urllib.parse.urlencode({
        "filters": json.dumps(filters),
        "fields":  json.dumps(fields),
        "limit":   str(limit),
    })
    data, _ = http_get(f"{url}?{qs}", frappe_headers())
    return data.get("data", [])

def frappe_create(doctype, doc):
    url  = f"{FRAPPE_URL}/api/resource/{urllib.parse.quote(doctype)}"
    data, status = http_post(url, frappe_headers(), doc)
    return data.get("data", {}), status


# ── Load Frappe tier map ────────────────────────────────────────────────────────

def load_tier_map():
    """Returns {tier_name: {name, tier_level, price_zar}} using the actual doc name."""
    rows = frappe_get_list(
        "BH Subscription Tier", [], ["name", "tier_name", "tier_level", "price_zar"], 20
    )
    return {r["tier_name"]: r for r in rows}


# ── Determine tier from a Paystack transaction ──────────────────────────────────

def resolve_tier(txn, tier_map):
    """
    Try to figure out which tier a transaction is for.
    Checks metadata first, then falls back to amount matching.
    Returns (tier_name, tier_doc) or (None, None).
    """
    meta = txn.get("metadata") or {}

    # Our proxy stores tier_name in metadata
    tier_name = meta.get("tier_name") or meta.get("custom_fields", [{}])[0].get("value", "")
    if tier_name and tier_name in tier_map:
        return tier_name, tier_map[tier_name]

    # Fall back: match by amount (amount is in kobo)
    amount_zar = txn.get("amount", 0) / 100
    for name, tier in tier_map.items():
        if tier.get("price_zar", 0) == amount_zar and amount_zar > 0:
            return name, tier

    return None, None


# ── Main ────────────────────────────────────────────────────────────────────────

def main():
    print("Backfill BH Subscriptions from Paystack — Brown Hat Academy")
    print(f"  Frappe  : {FRAPPE_URL}")
    print(f"  Mode    : {'DRY RUN' if DRY_RUN else 'LIVE'}")
    print()

    # Load tier map
    tier_map = load_tier_map()
    if not tier_map:
        print("ERROR: Could not load BH Subscription Tiers from Frappe")
        sys.exit(1)
    print("Tiers in Frappe:")
    for name, t in tier_map.items():
        print(f"  {name:<15} doc_name={t['name']}  level={t['tier_level']}  price=R{t['price_zar']}")
    print()

    # Fetch existing subscriptions to avoid duplicates
    existing_subs = frappe_get_list(
        "BH Subscription",
        [["status", "=", "Active"]],
        ["member", "paystack_reference"],
        200,
    )
    existing_refs    = {s.get("paystack_reference") for s in existing_subs if s.get("paystack_reference")}
    existing_members = {s["member"] for s in existing_subs if s.get("member")}
    print(f"Existing active subscriptions in Frappe: {len(existing_subs)}")
    print()

    # Fetch Paystack transactions
    print("Fetching successful Paystack transactions...")
    txns = paystack_all_successful_transactions()
    print(f"Found {len(txns)} successful transactions")
    print()

    created = 0
    skipped = 0
    errors  = 0

    for txn in txns:
        ref   = txn.get("reference", "")
        email = (txn.get("customer") or {}).get("email", "")
        if not email or not ref:
            continue

        # Skip if reference already recorded
        if ref in existing_refs:
            print(f"  SKIP  {email:<35} ref={ref[:12]}… (already has subscription by ref)")
            skipped += 1
            continue

        # Skip if member already has an active subscription (upgraded/downgraded via different ref)
        if email in existing_members:
            print(f"  SKIP  {email:<35} (already has active subscription)")
            skipped += 1
            continue

        # Resolve tier
        tier_name, tier_doc = resolve_tier(txn, tier_map)
        if not tier_name:
            amount_zar = txn.get("amount", 0) / 100
            print(f"  WARN  {email:<35} ref={ref[:12]}… amount=R{amount_zar} — could not resolve tier, SKIPPING")
            errors += 1
            continue

        # Dates
        paid_at    = txn.get("paid_at") or txn.get("created_at") or datetime.now().isoformat()
        try:
            start_date = datetime.fromisoformat(paid_at.replace("Z", "+00:00")).strftime("%Y-%m-%d")
        except Exception:
            start_date = datetime.now().strftime("%Y-%m-%d")
        end_date = (datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=30)).strftime("%Y-%m-%d")

        amount_zar = txn.get("amount", 0) / 100

        print(f"  CREATE {email:<35} tier={tier_name}  amount=R{amount_zar}  ref={ref[:12]}…")

        doc, status = frappe_create("BH Subscription", {
            "member":               email,
            "tier":                 tier_doc["name"],    # Frappe doc name, e.g. b9n43av1s0
            "status":               "Active",
            "paystack_reference":   ref,
            "start_date":           start_date,
            "end_date":             end_date,
            "amount_paid":          amount_zar,
        })

        if status in (200, 201) and doc.get("name"):
            print(f"         → Created: {doc['name']}")
            existing_members.add(email)
            existing_refs.add(ref)
            created += 1
        else:
            print(f"         → ERROR creating subscription (HTTP {status})")
            errors += 1

    print()
    print(f"Done: {created} created, {skipped} skipped, {errors} errors/warnings")
    if not DRY_RUN and created:
        print()
        print("Note: Users will get the correct tier_level on their NEXT login,")
        print("which issues a fresh JWT from the proxy reading BH Subscription.")


if __name__ == "__main__":
    main()
