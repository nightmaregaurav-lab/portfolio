import {join} from "node:path";
import {existsSync} from "node:fs";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import {CoreConfig, TestimonialsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import type {PageContentProps} from "./page.types";

const contentExists = existsSync(join(process.cwd(), "templates", CoreConfig.template, "testimonials", "page.content.tsx"));
const PageContent = dynamic<PageContentProps>(
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
  if (!contentExists) {
    notFound();
  }
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
