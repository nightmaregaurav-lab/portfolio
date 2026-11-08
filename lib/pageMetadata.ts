import type {Metadata} from "next";
import {CoreConfig} from "@/configuration";

export function getSiteName() {
  return CoreConfig.websiteName?.trim() || CoreConfig.fullName?.trim() || "Portfolio";
}

export function getAuthorName() {
  return CoreConfig.fullName?.trim() || getSiteName();
}

export function getSiteDescription() {
  return CoreConfig.seoDescription?.trim() || "A personal portfolio website.";
}

type PageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  section?: string;
  tags?: string[];
};

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return undefined;

  return new URL(siteUrl.endsWith("/") ? siteUrl : siteUrl + "/");
}

export function getCanonicalUrl(path: string) {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return undefined;

  return new URL(path.replace(/^\/+/, ""), siteUrl).toString();
}

export function getAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return getCanonicalUrl(pathOrUrl) || pathOrUrl;
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  keywords = CoreConfig.seoKeywords,
  type = "website",
  publishedTime,
  section,
  tags,
}: PageMetadataOptions): Metadata {
  const canonical = getCanonicalUrl(path);
  const imageUrl = getAbsoluteUrl(image || "/favicon.ico");
  const siteName = getSiteName();
  const authorName = getAuthorName();
  const resolvedDescription = description?.trim() || getSiteDescription();
  const fullTitle = title === siteName
    ? title
    : title + " | " + siteName;

  return {
    title: title === siteName ? {absolute: title} : title,
    description: resolvedDescription,
    keywords,
    authors: [{name: authorName}],
    alternates: canonical ? {canonical} : undefined,
    openGraph: {
      type,
      url: canonical,
      title: fullTitle,
      description: resolvedDescription,
      siteName,
      images: [{
        url: imageUrl,
        alt: fullTitle,
      }],
      ...(type === "article" ? {
        publishedTime,
        section,
        tags,
      } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [imageUrl],
    },
    robots: {index: true, follow: true},
  };
}
