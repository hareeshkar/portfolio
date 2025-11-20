import { useEffect } from "react";

const PRELOAD_VIDEOS = [
  "/videos/fsc.mp4",
  "/videos/isc.mp4",
  "/videos/aic.mp4",
];

export default function VideoPreloader() {
  useEffect(() => {
    // Only preload on fast connections
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    const shouldPreload = !connection || connection.effectiveType === "4g";

    if (!shouldPreload) return;

    PRELOAD_VIDEOS.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = src;
      link.type = "video/mp4";
      // Only preload metadata, not entire video
      link.setAttribute("fetchpriority", "low");
      document.head.appendChild(link);
    });

    return () => {
      // Cleanup preload links
      document
        .querySelectorAll('link[rel="preload"][as="video"]')
        .forEach((link) => {
          if (PRELOAD_VIDEOS.includes(link.href)) {
            link.remove();
          }
        });
    };
  }, []);

  return null;
}
