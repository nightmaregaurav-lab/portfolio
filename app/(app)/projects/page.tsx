import type React from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, JourneyConfig, ProjectsConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import {Suspense} from "react";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";

const templateType = getTemplateType("projects");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
      () => import(`@/templates/${CoreConfig.template}/projects/page.content`),
      {ssr: true}
    )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/projects/page.content`)).default as React.ComponentType<PageContentProps>)
    : null;

const description = stripHtmlTags(ProjectsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Projects",
  description,
  path: "/projects/",
  image: NavigationConfig.profilePicture || CoreConfig.favicon
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/projects/");
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PageContent
          projectsConfig={ProjectsConfig}
          journeyConfig={JourneyConfig}
        />
      </Suspense>

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Projects",
        description,
        ...(canonical ? {url: canonical} : {}),
      }} />
    </>
  );
}

export default Page;
