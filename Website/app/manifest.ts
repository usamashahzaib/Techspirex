import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Techspirex",
    short_name: "Techspirex",
    description: "Software development company in Lahore, Pakistan, serving clients worldwide.",
    start_url: "/",
    display: "browser",
    background_color: "#392a6f",
    theme_color: "#392a6f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
