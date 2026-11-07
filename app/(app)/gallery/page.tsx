import StructuredData from "@/components/StructuredData";
import {CoreConfig, GalleryConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import PageContent from "./page.content";

const description = stripHtmlTags(GalleryConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Gallery",
  description,
  path: "/gallery/",
  image: CoreConfig.favicon,
});

function Page() {
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
