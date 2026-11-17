import type {Metadata} from "next";
import {CoreConfig, NavigationConfig} from "@/configuration";

export function getSiteName() {
  return CoreConfig.websiteName?.trim() || CoreConfig.fullName?.trim() || "Portfolio";
}

export function getAuthorName() {
  return CoreConfig.fullName?.trim() || getSiteName();
}

export function getSiteDescription() {
  return CoreConfig.seoDescription?.trim() || "A personal portfolio website.";
}

export function getTwitterHandle() {
  const twitterSocial = NavigationConfig.socials.find((s) =>
    /twitter\.com|x\.com/i.test(s.url)
  );
  if (twitterSocial) {
    const match = twitterSocial.url.match(/(?:twitter\.com|x\.com)\/([^/]+)/);
    if (match) return "@" + match[1];
  }

  return undefined;
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://localhost:3000";
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
  keywords,
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

  const coreKeywords = CoreConfig.seoKeywords || [];
  const resolvedKeywords = keywords
    ? [...keywords, ...coreKeywords]
    : coreKeywords;

  return {
    title: title === siteName ? {absolute: title} : title,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    authors: [{name: authorName}],
    alternates: canonical ? {
      canonical,
      languages: {'en': canonical},
    } : undefined,
    openGraph: {
      type,
      url: canonical,
      title: fullTitle,
      description: resolvedDescription,
      siteName,
      locale: "en_US",
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
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
      ...(getTwitterHandle() ? {site: getTwitterHandle()} : {}),
      title: fullTitle,
      description: resolvedDescription,
      images: [imageUrl],
    },
    robots: {index: true, follow: true},
  };
}
