import type { MetadataRoute } from "next";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Ink & Ideas";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} Blog`,
    short_name: SITE_NAME,
    description: "Premium writing on design, technology, and ideas.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#6366F1",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
