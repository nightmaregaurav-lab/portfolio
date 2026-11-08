import {CoreConfig, TestimonialsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import PageContent from "./page.content";

const description = stripHtmlTags(TestimonialsConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Testimonials",
  description: description,
  path: "/testimonials/",
  image: CoreConfig.favicon,
});

function Page() {
  const canonical = getCanonicalUrl("/testimonials/");
  return (
    <>
      <PageContent
        testimonialsConfig={TestimonialsConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Testimonials",
        description,
        ...(canonical ? {url: canonical} : {}),
      }}/>
    </>
  );
}

export default Page;
