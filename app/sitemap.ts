import type {MetadataRoute} from "next";
import {
  BlogsConfig,
  GalleryConfig,
  ProjectsConfig,
} from "@/configuration";
import {getAbsoluteUrl, getCanonicalUrl} from "@/lib/pageMetadata";

export const dynamic = "force-static";

const staticRoutes = [
  {path: "/", priority: 1, changeFrequency: "monthly" as const},
  {path: "/about/", priority: 0.8, changeFrequency: "monthly" as const},
  {path: "/projects/", priority: 0.8, changeFrequency: "monthly" as const},
  {path: "/services/", priority: 0.7, changeFrequency: "monthly" as const},
  {path: "/skills/", priority: 0.7, changeFrequency: "monthly" as const},
  {path: "/journey/", priority: 0.6, changeFrequency: "monthly" as const},
  {path: "/testimonials/", priority: 0.6, changeFrequency: "monthly" as const},
  {path: "/gallery/", priority: 0.6, changeFrequency: "monthly" as const},
  {path: "/blogs/", priority: 0.8, changeFrequency: "weekly" as const},
];

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

  for (const project of ProjectsConfig.projects) {
    const slug = getSitemapSlug(project.slugs);
    const url = slug ? getCanonicalUrl("/projects/" + slug + "/") : undefined;
    if (url) {
      urls.push({
        url,
        changeFrequency: "monthly",
        priority: 0.7,
        images: project.previewImage ? [getAbsoluteUrl(project.previewImage)] : undefined,
      });
    }
  }

  for (const post of BlogsConfig.posts) {
    const slug = getSitemapSlug(post.slugs);
    const url = slug ? getCanonicalUrl("/blogs/" + slug + "/") : undefined;
    if (url) {
      urls.push({
        url,
        lastModified: post.date,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  for (const collection of GalleryConfig.categories) {
    const slug = getSitemapSlug(collection.slugs);
    const url = slug ? getCanonicalUrl("/gallery/" + slug + "/") : undefined;
    if (url) {
      urls.push({
        url,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return urls;
}
