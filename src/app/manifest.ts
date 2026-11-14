import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parramatta Explorer",
    short_name: "Parra Explorer",
    description:
      "Find what's on across Parramatta and plan events that work for everyone. Offline-ready event and access information.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#034f84",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
