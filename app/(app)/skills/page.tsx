import dynamic from "next/dynamic";
import {CoreConfig, SkillsConfig, JourneyConfig, ProjectsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import type {TModel as SkillsModel} from "@/configuration/skills";
import type {TModel as JourneyModel} from "@/configuration/journey";
import type {TModel as ProjectsModel} from "@/configuration/projects";

const PageContent = dynamic<{
  skillsConfig: SkillsModel;
  journeyConfig: JourneyModel;
  projectsConfig: ProjectsModel;
}>(
  () => import(`@/templates/${CoreConfig.template}/skills/page.content`),
  {ssr: true}
);

const description = stripHtmlTags(SkillsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Skills",
  description,
  path: "/skills/",
  image: CoreConfig.favicon,
});

function Page() {
  const canonical = getCanonicalUrl("/skills/");
  return (
    <>
      <PageContent
        skillsConfig={SkillsConfig}
        journeyConfig={JourneyConfig}
        projectsConfig={ProjectsConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Skills",
        description,
        ...(canonical ? {url: canonical} : {}),
      }}/>
    </>
  );
}

export default Page;
