import type React from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import {CoreConfig, ServicesConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";

const templateType = getTemplateType("services");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
      () => import(`@/templates/${CoreConfig.template}/services/page.content`),
      {ssr: true}
    )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/services/page.content`)).default as React.ComponentType<PageContentProps>)
    : null;

const description = stripHtmlTags(ServicesConfig.services.length
  ? ServicesConfig.services.map((service) => service.title).join(", ")
  : "Services offered by " + CoreConfig.fullName
).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Services",
  description,
  path: "/services/",
  image: NavigationConfig.profilePicture || CoreConfig.favicon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/services/");
  return (
    <>
      <PageContent
        servicesConfig={ServicesConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Services",
        description,
        ...(canonical ? {url: canonical} : {}),
      }} />
    </>
  );
}

export default Page;
