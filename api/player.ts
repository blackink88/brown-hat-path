/**
 * Bare-HTML video player for Bunny.net videos.
 * Served at /player/:guid — embedded as an iframe inside Frappe LMS lessons.
 * Returns pure HTML with no React, no layout, just the video.
 */
export const config = { runtime: "edge" };

const LIBRARY_ID = "626967";

export default function handler(req: Request) {
  const url  = new URL(req.url);
  const guid = url.searchParams.get("guid") || "";

  if (!guid) {
    return new Response("No video specified.", { status: 400 });
  }

  const src = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${guid}?autoplay=false&preload=true`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Video</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:100%; height:100%; overflow:hidden; background:#000; }
    iframe { width:100%; height:100%; border:none; display:block; }
  </style>
</head>
<body>
  <iframe
    src="${src}"
    width="100%" height="100%"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
    allowfullscreen
    loading="lazy">
  </iframe>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy":
        "frame-src https://iframe.mediadelivery.net; " +
        "frame-ancestors https://portal.brownhat.academy https://lms-dzr-tbs.c.frappe.cloud 'self'",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
