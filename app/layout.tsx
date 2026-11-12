import type {Metadata, Viewport} from "next";
import React from "react";
import "./globals.css";
import "@/components/block-editor/style.css";
import Providers from "@/app/Providers";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, HomeConfig, NavigationConfig} from "@/configuration";
import {
  getAbsoluteUrl,
  getAuthorName,
  getCanonicalUrl,
  getSiteDescription,
  getSiteName,
  getSiteUrl,
} from "@/lib/pageMetadata";

const siteUrl = getSiteUrl();
const canonical = getCanonicalUrl("/");
const siteName = getSiteName();
const authorName = getAuthorName();
const siteDescription = getSiteDescription();
const socialImage = getAbsoluteUrl(HomeConfig.coverPicture || CoreConfig.favicon || "/favicon.ico");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: "%s | " + siteName,
  },
  description: siteDescription,
  keywords: CoreConfig.seoKeywords,
  authors: [{
    name: authorName
  }],
  alternates: canonical ? {canonical} : undefined,
  icons: {
    icon: CoreConfig.favicon || "/favicon.ico",
    apple: CoreConfig.favicon || "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  category: "portfolio",
  creator: authorName,
  publisher: authorName,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    url: canonical,
    title: siteName,
    description: siteDescription,
    siteName,
    locale: "en_US",
    images: [{
      url: socialImage,
      alt: CoreConfig.websiteName,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

function RootLayout({children}: LayoutProps<"/">) {
  return (
    <html lang="en" data-google-analytics-opt-out="">
      <body>
        <Providers>
          {children}
          <StructuredData data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                name: authorName,
                image: socialImage,
                ...(canonical ? {url: canonical} : {}),
                sameAs: NavigationConfig.socials.map((social) => social.url),
              },
              {
                "@type": "WebSite",
                name: siteName,
                description: siteDescription,
                ...(canonical ? {url: canonical} : {}),
              },
            ],
          }} />
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
