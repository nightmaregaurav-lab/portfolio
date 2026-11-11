import dynamic from "next/dynamic";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, JourneyConfig, ProjectsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import {Suspense} from "react";
import type {TModel as ProjectsModel} from "@/configuration/projects";
import type {TModel as JourneyModel} from "@/configuration/journey";

const PageContent = dynamic<{
  projectsConfig: ProjectsModel;
  journeyConfig: JourneyModel;
}>(
  () => import(`@/templates/${CoreConfig.template}/projects/page.content`),
  {ssr: true}
);

const description = stripHtmlTags(ProjectsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Projects",
  description,
  path: "/projects/",
  image: CoreConfig.favicon
});

function Page() {
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
