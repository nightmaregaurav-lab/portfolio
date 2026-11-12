import type {MetadataRoute} from "next";
import {LeftPanelConfig} from "@/configuration";
import {getCanonicalUrl} from "@/lib/pageMetadata";

export const dynamic = "force-static";

const MENU_PATH_MAP = [
  {menu: "home", path: "/"},
  {menu: "about", path: "/about/"},
  {menu: "projects", path: "/projects/"},
  {menu: "services", path: "/services/"},
  {menu: "skills", path: "/skills/"},
  {menu: "journey", path: "/journey/"},
  {menu: "testimonials", path: "/testimonials/"},
  {menu: "gallery", path: "/gallery/"},
  {menu: "blogs", path: "/blogs/"},
];

// Menus that have child routes (e.g., /blogs/<slug>, /projects/<slug>, /gallery/<slug>)
const CHILD_MENU_KEYS = new Set(["blogs", "projects", "gallery"]);

const disabledPaths = MENU_PATH_MAP.filter(
  (item) => !LeftPanelConfig.enabledNavigations.includes(item.menu)
).flatMap((item) => {
  const paths = [item.path];
  // If the disabled menu has children, also disallow the wildcard child path
  if (CHILD_MENU_KEYS.has(item.menu)) {
    paths.push(item.path + "*");
  }
  return paths;
});

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/setup/", "/404.html", "/cdn-cgi/", ...disabledPaths],
    },
    sitemap: getCanonicalUrl("/sitemap.xml"),
  };
}
