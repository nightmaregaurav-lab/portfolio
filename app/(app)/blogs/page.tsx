import StructuredData from "@/components/StructuredData";
import {CoreConfig, BlogsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import PageContent from "./page.content";
import {Suspense} from "react";

const description = stripHtmlTags(BlogsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Blog",
  description,
  path: "/blogs/",
  image: CoreConfig.favicon,
});

export default function Page() {
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
