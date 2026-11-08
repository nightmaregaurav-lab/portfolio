import type {MetadataRoute} from "next";
import {getCanonicalUrl} from "@/lib/pageMetadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/setup/", "/404.html", "/cdn-cgi/"],
    },
    sitemap: getCanonicalUrl("/sitemap.xml"),
  };
}
