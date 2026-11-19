import type React from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import {CoreConfig, TestimonialsConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";

const templateType = getTemplateType("testimonials");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
      () => import(`@/templates/${CoreConfig.template}/testimonials/page.content`),
      {ssr: true}
    )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/testimonials/page.content`)).default as React.ComponentType<PageContentProps>)
    : null;

const description = stripHtmlTags(TestimonialsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Testimonials",
  description: description,
  path: "/testimonials/",
  image: NavigationConfig.profilePicture || CoreConfig.favicon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/testimonials/");
  return (
    <>
      <PageContent
        testimonialsConfig={TestimonialsConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Testimonials",
        description,
        ...(canonical ? {url: canonical} : {}),
      }}/>
    </>
  );
}

export default Page;
