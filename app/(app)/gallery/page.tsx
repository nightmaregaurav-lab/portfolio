import React, {Suspense} from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, GalleryConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";

const templateType = getTemplateType("gallery");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
      () => import(`@/templates/${CoreConfig.template}/gallery/page.content`),
      {ssr: true}
    )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/gallery/page.content`)).default as React.ComponentType<PageContentProps>)
    : null;

const description = stripHtmlTags(GalleryConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Gallery",
  description,
  path: "/gallery/",
  image: NavigationConfig.profilePicture || CoreConfig.favicon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/gallery/");
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PageContent
          galleryConfig={GalleryConfig}
        />
      </Suspense>

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Gallery",
        description,
        ...(canonical ? {url: canonical} : {}),
      }} />
    </>
  );
}

export default Page;
