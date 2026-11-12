import {join} from "node:path";
import {existsSync} from "node:fs";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, GalleryConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import type {PageContentProps} from "./page.types";

const contentExists = existsSync(join(process.cwd(), "templates", CoreConfig.template, "gallery", "page.content.tsx"));
const PageContent = dynamic<PageContentProps>(
  () => import(`@/templates/${CoreConfig.template}/gallery/page.content`),
  {ssr: true}
);

const description = stripHtmlTags(GalleryConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Gallery",
  description,
  path: "/gallery/",
  image: CoreConfig.favicon,
});

function Page() {
  if (!contentExists) {
    notFound();
  }
  const canonical = getCanonicalUrl("/gallery/");
  return (
    <>
      <PageContent
        galleryConfig={GalleryConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Gallery",
        description,
        ...(canonical ? {url: canonical} : {}),
      }} />
    </>
  );
}

export default Page;
