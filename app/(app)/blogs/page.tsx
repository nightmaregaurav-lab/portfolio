import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { BlogsConfig, CoreConfig, NavigationConfig } from "@/configuration";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../PageLoading";
import type { PageContentProps } from "./page.types";

const templateType = getTemplateType("blogs");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () => import(`@/templates/${CoreConfig.template}/blogs/page.content`),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((await import(`@/templates/${CoreConfig.template}/blogs/page.content`))
          .default as React.ComponentType<PageContentProps>)
      : null;

const description = stripHtmlTags(BlogsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Blogs",
  description,
  path: "/blogs/",
  image: NavigationConfig.profilePicture || CoreConfig.favicon,
});

function Page() {
  if (!PageContent) {
    notFound();
  }
  const canonical = getCanonicalUrl("/blogs/");
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent blogsConfig={BlogsConfig} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${CoreConfig.websiteName} Blog`,
          description,
          ...(canonical ? { url: canonical } : {}),
          author: { "@type": "Person", name: CoreConfig.fullName },
        }}
      />
    </>
  );
}

export default Page;
