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
import PageLoading from "../../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("projects/[projectSlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/projects/[projectSlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/projects/[projectSlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = ProjectsConfig.projects
    .flatMap((x) => x.slugs)
    .map((x) => x.slug);

  return [
    ...slugs.map((slug) => ({ projectSlug: slug })),
    { projectSlug: "__404__" },
  ];
}

function findProject(projectSlug: string) {
  return ProjectsConfig.projects.find(
    (project) => project.slugs.findIndex((x) => x.slug === projectSlug) !== -1,
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const project = findProject(projectSlug);
  if (!project) {
    return {};
  }

  return createPageMetadata({
    title: project.title,
    description: stripHtmlTags(project.description).slice(0, 300),
    path: `/projects/${projectSlug}/`,
    image:
      project.previewImage ||
      NavigationConfig.profilePicture ||
      CoreConfig.favicon,
    keywords: project.seoKeywords || [],
    type: "article",
  });
}

async function Page({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const project = findProject(projectSlug);
  if (!project) {
    notFound();
  }

  const milestone = project.milestoneId
    ? JourneyConfig.milestones.find((item) => item.id === project.milestoneId)
    : undefined;

  const linkedSkills = SkillsConfig.skills.filter((skill) =>
    (skill.associatedProjectIds || []).includes(project.id),
  );

  const canonical = getCanonicalUrl(`/projects/${projectSlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent
          project={project}
          milestone={milestone}
          skills={linkedSkills}
        />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: stripHtmlTags(project.description),
          ...(project.previewImage ? { image: project.previewImage } : {}),
          ...(canonical ? { url: canonical } : {}),
          author: { "@type": "Person", name: CoreConfig.fullName },
          keywords: project.seoKeywords || [],
        }}
      />
    </>
  );
}

export default Page;
