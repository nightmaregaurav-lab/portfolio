import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import {
  CoreConfig,
  JourneyConfig,
  NavigationConfig,
  ProjectsConfig,
  SkillsConfig,
} from "@/configuration";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("skills");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () => import(`@/templates/${CoreConfig.template}/skills/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(`@/templates/${CoreConfig.template}/skills/page.content`)
        ).default as React.ComponentType<PageContentProps>)
      : null;

const description = stripHtmlTags(SkillsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Skills",
  description,
  path: "/skills/",
  image: NavigationConfig.profilePicture || CoreConfig.favicon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/skills/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent
          skillsConfig={SkillsConfig}
          journeyConfig={JourneyConfig}
          projectsConfig={ProjectsConfig}
        />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Skills",
          description,
          ...(canonical ? { url: canonical } : {}),
        }}
      />
    </>
  );
}

export default Page;
