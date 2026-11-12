import {join} from "node:path";
import {existsSync} from "node:fs";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, BlogsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import {Suspense} from "react";
import type {PageContentProps} from "./page.types";

const contentExists = existsSync(join(process.cwd(), "templates", CoreConfig.template, "blogs", "page.content.tsx"));
const PageContent = dynamic<PageContentProps>(
  () => import(`@/templates/${CoreConfig.template}/blogs/page.content`),
  {ssr: true}
);

const description = stripHtmlTags(BlogsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Blog",
  description,
  path: "/blogs/",
  image: CoreConfig.favicon,
});

export default function Page() {
  if (!contentExists) {
    notFound();
  }
  const canonical = getCanonicalUrl("/blogs/");
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
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
