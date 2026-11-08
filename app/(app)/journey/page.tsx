import {CoreConfig, JourneyConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import PageContent from "./page.content";

const description = stripHtmlTags(JourneyConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "My Journey",
  description,
  path: "/journey/",
  image: CoreConfig.favicon,
});

function Page() {
  const canonical = getCanonicalUrl("/journey/");
  return (
    <>
      <PageContent
        journeyConfig={JourneyConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "My Journey",
        description,
        ...(canonical ? {url: canonical} : {}),
      }}/>
    </>
  );
}

export default Page;
