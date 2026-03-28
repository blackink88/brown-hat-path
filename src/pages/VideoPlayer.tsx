import { useParams } from "react-router-dom";

const LIBRARY_ID = "626967";

/**
 * Minimal full-screen Bunny.net video player page.
 * Embedded as an iframe inside Frappe LMS lessons.
 *
 * URL: /player/:guid
 * Embed in Frappe lesson: https://www.brownhat.academy/player/{GUID}
 */
export default function VideoPlayer() {
  const { guid } = useParams<{ guid: string }>();

  if (!guid) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#000", color: "#fff", fontFamily: "sans-serif" }}>
        No video specified.
      </div>
    );
  }

  const src = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${guid}?autoplay=false&preload=true`;

  return (
    <iframe
      src={src}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  );
}
