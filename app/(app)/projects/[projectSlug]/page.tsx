import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, JourneyConfig, ProjectsConfig, SkillsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import PageContent from "./page.content";

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = ProjectsConfig
    .projects
    .flatMap(x => x.slugs)
    .map(x => x.slug);

  return [
    ...slugs.map((slug) => ({projectSlug: slug})),
    {projectSlug: "__404__"},
  ];
}

function findProject(projectSlug: string) {
  return ProjectsConfig
    .projects
    .find((project) => project.slugs.findIndex(x => x.slug == projectSlug) != -1);
}

export async function generateMetadata(
  {params}: { params: Promise<{projectSlug: string}>; }
) {
  const {projectSlug} = await params;
  const project = findProject(projectSlug);
  if (!project) {
    return {};
  }

  return createPageMetadata({
    title: project.title,
    description: stripHtmlTags(project.description).slice(0, 300),
    path: "/projects/" + projectSlug + "/",
    image: project.previewImage || CoreConfig.favicon,
    keywords: project.seoKeywords || [],
    type: "article",
  });
}

async function Page(
  {params}: { params: Promise<{projectSlug: string}>; }
) {
  const {projectSlug} = await params;
  const project = findProject(projectSlug);
  if (!project) {
    notFound();
  }

  const milestone = project.milestoneId
    ? JourneyConfig.milestones.find((item) => item.id === project.milestoneId)
    : undefined;

  const linkedSkills = SkillsConfig
    .skills
    .filter((skill) => (skill.associatedProjectIds || []).includes(project.id));

  const canonical = getCanonicalUrl("/projects/" + projectSlug + "/");
  return (
    <>
      <PageContent
        project={project}
        milestone={milestone}
        skills={linkedSkills}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: stripHtmlTags(project.description),
        ...(project.previewImage ? {image: project.previewImage} : {}),
        ...(canonical ? {url: canonical} : {}),
        author: {"@type": "Person", name: CoreConfig.fullName},
        keywords: project.seoKeywords || [],
      }} />
    </>
  );
}

export default Page;
