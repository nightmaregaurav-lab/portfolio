import type {MetadataRoute} from "next";
import {CoreConfig, HomeConfig} from "@/configuration";
import {getSiteDescription, getSiteName} from "@/lib/pageMetadata";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: getSiteName(),
    short_name: getSiteName(),
    description: getSiteDescription() || HomeConfig.bio || "Personal portfolio",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [{
      src: CoreConfig.favicon || "/favicon.ico",
      sizes: "any",
      type: "image/x-icon",
    }],
  };
}
