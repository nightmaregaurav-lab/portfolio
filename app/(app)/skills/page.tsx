import {CoreConfig, SkillsConfig, JourneyConfig, ProjectsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import PageContent from "./page.content";

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
