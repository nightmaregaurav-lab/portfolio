import dynamic from "next/dynamic";
import {CoreConfig, TestimonialsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import type {TModel as TestimonialsModel} from "@/configuration/testimonials";

const PageContent = dynamic<{
  testimonialsConfig: TestimonialsModel;
}>(
  () => import(`@/templates/${CoreConfig.template}/testimonials/page.content`),
  {ssr: true}
);

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
