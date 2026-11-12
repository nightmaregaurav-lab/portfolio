import {join} from "node:path";
import {existsSync} from "node:fs";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import {CoreConfig, JourneyConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import type {PageContentProps} from "./page.types";

const contentExists = existsSync(join(process.cwd(), "templates", CoreConfig.template, "journey", "page.content.tsx"));
const PageContent = dynamic<PageContentProps>(
  () => import(`@/templates/${CoreConfig.template}/journey/page.content`),
  {ssr: true}
);

const description = stripHtmlTags(JourneyConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "My Journey",
  description,
  path: "/journey/",
  image: CoreConfig.favicon,
});

function Page() {
  if (!contentExists) {
    notFound();
  }
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
