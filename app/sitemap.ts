import type {MetadataRoute} from "next";
import {
  BlogsConfig,
  GalleryConfig,
  LeftPanelConfig,
  ProjectsConfig,
} from "@/configuration";
import {getAbsoluteUrl, getCanonicalUrl} from "@/lib/pageMetadata";

export const dynamic = "force-static";

const MENU_PATH_MAP = [
  {menu: "home", path: "/", priority: 1, changeFrequency: "monthly" as const},
  {menu: "about", path: "/about/", priority: 0.8, changeFrequency: "monthly" as const},
  {menu: "projects", path: "/projects/", priority: 0.8, changeFrequency: "monthly" as const},
  {menu: "services", path: "/services/", priority: 0.7, changeFrequency: "monthly" as const},
  {menu: "skills", path: "/skills/", priority: 0.7, changeFrequency: "monthly" as const},
  {menu: "journey", path: "/journey/", priority: 0.6, changeFrequency: "monthly" as const},
  {menu: "testimonials", path: "/testimonials/", priority: 0.6, changeFrequency: "monthly" as const},
  {menu: "gallery", path: "/gallery/", priority: 0.6, changeFrequency: "monthly" as const},
  {menu: "blogs", path: "/blogs/", priority: 0.8, changeFrequency: "daily" as const},
];

const staticRoutes = MENU_PATH_MAP.filter(
  (item) => LeftPanelConfig.enabledNavigations.includes(item.menu)
);

function getSitemapSlug(slugs: {slug: string; isActive: boolean}[]) {
  return slugs.find((slug) => slug.isActive)?.slug || slugs[0]?.slug;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = staticRoutes.flatMap((route) => {
    const url = getCanonicalUrl(route.path);
    return url ? [{
      url,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }] : [];
  });

  if (LeftPanelConfig.enabledNavigations.includes("projects")) {
    for (const project of ProjectsConfig.projects) {
      const slug = getSitemapSlug(project.slugs);
      const url = slug ? getCanonicalUrl("/projects/" + slug + "/") : undefined;
      if (url) {
        urls.push({
          url,
          changeFrequency: "weekly",
          priority: 0.7,
          images: project.previewImage ? [getAbsoluteUrl(project.previewImage)] : undefined,
        });
      }
    }
  }

  if (LeftPanelConfig.enabledNavigations.includes("blogs")) {
    for (const post of BlogsConfig.posts) {
      const slug = getSitemapSlug(post.slugs);
      const url = slug ? getCanonicalUrl("/blogs/" + slug + "/") : undefined;
      if (url) {
        urls.push({
          url,
          lastModified: post.date,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  if (LeftPanelConfig.enabledNavigations.includes("gallery")) {
    for (const collection of GalleryConfig.categories) {
      const slug = getSitemapSlug(collection.slugs);
      const url = slug ? getCanonicalUrl("/gallery/" + slug + "/") : undefined;
      if (url) {
        urls.push({
          url,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      }
    }
  }

  return urls;
}
