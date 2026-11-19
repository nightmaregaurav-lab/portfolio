import type React from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import {CoreConfig, JourneyConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";

const templateType = getTemplateType("journey");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
      () => import(`@/templates/${CoreConfig.template}/journey/page.content`),
      {ssr: true}
    )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/journey/page.content`)).default as React.ComponentType<PageContentProps>)
    : null;

const description = stripHtmlTags(JourneyConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "My Journey",
  description,
  path: "/journey/",
  image: NavigationConfig.profilePicture || CoreConfig.favicon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/journey/");
  return (
    <>
      <PageContent
        journeyConfig={JourneyConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "My Journey",
        description,
        ...(canonical ? {url: canonical} : {}),
      }}/>
    </>
  );
}

export default Page;
