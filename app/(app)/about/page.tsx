import type React from "react";
import {Suspense} from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {AboutConfig, CoreConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";
import PageLoading from "../PageLoading";

const templateType = getTemplateType("about");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
    () => import(`@/templates/${CoreConfig.template}/about/page.content`),
    {ssr: true}
  )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/about/page.content`)).default as React.ComponentType<PageContentProps>)
    : null;

const description = stripHtmlTags(AboutConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "About",
  description,
  path: "/about/",
  image: AboutConfig.heroPicture
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/about/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent
          coreConfig={CoreConfig}
          aboutConfig={AboutConfig}
        />
      </Suspense>

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About " + CoreConfig.fullName,
        description,
        ...(canonical ? {url: canonical} : {}),
        mainEntity: {
          "@type": "Person",
          name: CoreConfig.fullName,
          image: AboutConfig.heroPicture,
        },
      }} />
    </>
  );
}

export default Page;
