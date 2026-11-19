import type React from "react";
import {Suspense} from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, TestimonialsConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";
import PageLoading from "../PageLoading";

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
      <Suspense fallback={<PageLoading />}>
        <PageContent
          testimonialsConfig={TestimonialsConfig}
        />
      </Suspense>

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
