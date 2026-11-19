import type React from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, BlogsConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import {Suspense} from "react";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";
import PageLoading from "../PageLoading";

const templateType = getTemplateType("blogs");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
      () => import(`@/templates/${CoreConfig.template}/blogs/page.content`),
      {ssr: true}
    )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/blogs/page.content`)).default as React.ComponentType<PageContentProps>)
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
        <PageContent
          blogsConfig={BlogsConfig}
        />
      </Suspense>

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        name: CoreConfig.websiteName + " Blog",
        description,
        ...(canonical ? {url: canonical} : {}),
        author: {"@type": "Person", name: CoreConfig.fullName},
      }} />
    </>
  );
}

export default Page;
