import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js App",
    short_name: "RB Portfolio",
    description: "Richard`s digital buisness card",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
