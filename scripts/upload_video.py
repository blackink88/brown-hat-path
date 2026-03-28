#!/usr/bin/env python3
"""
upload_video.py — Upload a video to Bunny.net Stream and update a Frappe lesson

Usage:
  python3 scripts/upload_video.py <video_file> <lesson_name_in_frappe>
  python3 scripts/upload_video.py <video_file>          # upload only, print embed URL

Examples:
  python3 scripts/upload_video.py ~/Videos/intro.mp4 "Introduction to GRC"
  python3 scripts/upload_video.py ~/Videos/module1.mp4

The script will:
  1. Create a video slot in Bunny.net Stream
  2. Upload the file (shows progress)
  3. Print the embed URL
  4. If a Frappe lesson name is given, update that lesson's video field

Embed URL format:
  https://iframe.mediadelivery.net/embed/626967/{VIDEO_GUID}
"""

import os, sys, json, urllib.parse, urllib.request, urllib.error

BUNNY_LIBRARY_ID  = os.environ.get("BUNNY_STREAM_LIBRARY_ID",  "626967")
BUNNY_API_KEY     = os.environ.get("BUNNY_STREAM_API_KEY",     "c993f12d-cfa2-4804-a2f5ffd3a934-19d7-4235")
BUNNY_BASE        = f"https://video.bunnycdn.com/library/{BUNNY_LIBRARY_ID}"
EMBED_BASE        = f"https://iframe.mediadelivery.net/embed/{BUNNY_LIBRARY_ID}"
PLAYER_BASE       = "https://www.brownhat.academy/player"  # proxies Bunny via our domain

FRAPPE_URL        = os.environ.get("FRAPPE_URL",        "https://lms-dzr-tbs.c.frappe.cloud")
FRAPPE_API_KEY    = os.environ.get("FRAPPE_API_KEY",    "c051ee2f244a78a")
FRAPPE_API_SECRET = os.environ.get("FRAPPE_API_SECRET", "0ef76927d6e142d")


def bunny_headers():
    return {"AccessKey": BUNNY_API_KEY, "Accept": "application/json", "Content-Type": "application/json"}

def frappe_headers():
    return {
        "Authorization": f"token {FRAPPE_API_KEY}:{FRAPPE_API_SECRET}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


# ── Step 1: Create a video slot in Bunny ───────────────────────────────────────

def create_video(title: str) -> str:
    """Returns the video GUID."""
    url  = f"{BUNNY_BASE}/videos"
    body = json.dumps({"title": title}).encode()
    req  = urllib.request.Request(url, data=body, headers=bunny_headers(), method="POST")
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read())
    guid = data.get("guid")
    if not guid:
        raise RuntimeError(f"No GUID returned: {data}")
    return guid


# ── Step 2: Upload the video file ─────────────────────────────────────────────

def upload_video(guid: str, file_path: str):
    """Streams the file to Bunny with a progress bar."""
    file_size = os.path.getsize(file_path)
    url       = f"{BUNNY_BASE}/videos/{guid}"

    print(f"  Uploading {os.path.basename(file_path)} ({file_size / 1024 / 1024:.1f} MB)...")

    uploaded = [0]

    class ProgressReader:
        def __init__(self, f, total):
            self._f     = f
            self._total = total

        def read(self, size=-1):
            chunk = self._f.read(size)
            if chunk:
                uploaded[0] += len(chunk)
                pct = uploaded[0] / self._total * 100
                bar = "█" * int(pct / 5) + "░" * (20 - int(pct / 5))
                print(f"\r  [{bar}] {pct:.1f}%", end="", flush=True)
            return chunk

        def __len__(self):
            return self._total

    headers = {
        "AccessKey":      BUNNY_API_KEY,
        "Content-Type":   "application/octet-stream",
        "Content-Length": str(file_size),
    }

    with open(file_path, "rb") as f:
        reader  = ProgressReader(f, file_size)
        req     = urllib.request.Request(url, data=reader, headers=headers, method="PUT")
        req.add_unredirected_header("Content-Length", str(file_size))
        with urllib.request.urlopen(req, timeout=3600) as r:
            result = json.loads(r.read())

    print()  # newline after progress bar
    if result.get("success") is False:
        raise RuntimeError(f"Upload failed: {result}")


# ── Step 3: Update Frappe lesson ──────────────────────────────────────────────

def find_lesson(title: str) -> str | None:
    """Find a Frappe LMS Lesson by title, return its name."""
    url = f"{FRAPPE_URL}/api/resource/Course%20Lesson"
    qs  = urllib.parse.urlencode({
        "filters": json.dumps([["title", "like", f"%{title}%"]]),
        "fields":  json.dumps(["name", "title"]),
        "limit":   "5",
    })
    req = urllib.request.Request(f"{url}?{qs}", headers=frappe_headers())
    with urllib.request.urlopen(req, timeout=30) as r:
        rows = json.loads(r.read()).get("data", [])

    if not rows:
        return None
    if len(rows) == 1:
        return rows[0]["name"]

    print("  Multiple lessons found:")
    for i, row in enumerate(rows):
        print(f"    [{i}] {row['name']} — {row['title']}")
    choice = input("  Pick number: ").strip()
    return rows[int(choice)]["name"] if choice.isdigit() else None


def update_lesson_video(lesson_name: str, embed_url: str):
    """Clears the youtube field and embeds the video as a raw HTML block in content."""
    # Use brownhat.academy/player/{guid} as the iframe src so Frappe Cloud's
    # CSP doesn't block it (we control headers on our domain via Vercel)
    guid        = embed_url.split("/")[-1].split("?")[0]
    player_url  = f"{PLAYER_BASE}/{guid}"
    iframe = (
        '<div style="position:relative;padding-top:56.25%;">'
        f'<iframe src="{player_url}" loading="lazy" '
        'style="border:none;position:absolute;top:0;left:0;height:100%;width:100%;" '
        'allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" '
        'allowfullscreen="true"></iframe></div>'
    )
    content = json.dumps({
        "time": int(__import__("time").time() * 1000),
        "blocks": [{"id": "bunny-video", "type": "raw", "data": {"html": iframe}}],
        "version": "2.29.0",
    })
    url  = f"{FRAPPE_URL}/api/resource/Course%20Lesson/{urllib.parse.quote(lesson_name)}"
    body = json.dumps({"youtube": "", "content": content}).encode()
    req  = urllib.request.Request(url, data=body, headers=frappe_headers(), method="PUT")
    with urllib.request.urlopen(req, timeout=30) as r:
        result = json.loads(r.read())
    return result.get("data", {}).get("name")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    file_path    = sys.argv[1]
    lesson_query = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.isfile(file_path):
        print(f"ERROR: File not found: {file_path}")
        sys.exit(1)

    title = os.path.splitext(os.path.basename(file_path))[0]
    print(f"Video title  : {title}")
    print(f"Library ID   : {BUNNY_LIBRARY_ID}")
    print()

    # 1. Create slot
    print("1. Creating video slot in Bunny.net...")
    guid = create_video(title)
    embed_url = f"{EMBED_BASE}/{guid}"
    print(f"   GUID      : {guid}")
    print(f"   Embed URL : {embed_url}")
    print()

    # 2. Upload
    print("2. Uploading video...")
    upload_video(guid, file_path)
    print("   Upload complete.")
    print()

    # 3. Update Frappe lesson (optional)
    if lesson_query:
        print(f"3. Finding Frappe lesson matching '{lesson_query}'...")
        lesson_name = find_lesson(lesson_query)
        if lesson_name:
            update_lesson_video(lesson_name, embed_url)
            print(f"   Updated lesson: {lesson_name}")
        else:
            print("   No matching lesson found. Set the video URL manually:")
            print(f"   {embed_url}")
    else:
        print("Embed URL to paste into Frappe lesson:")
        print(f"  {embed_url}")
        print()
        print("In Frappe Desk → LMS Lesson → open the lesson → paste into the 'YouTube' field.")


if __name__ == "__main__":
    main()
