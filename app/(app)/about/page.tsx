import {join} from "node:path";
import {existsSync} from "node:fs";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {AboutConfig, CoreConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import type {PageContentProps} from "./page.types";

const description = stripHtmlTags(AboutConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "About",
  description,
  path: "/about/",
  image: AboutConfig.heroPicture
});

const contentExists = existsSync(join(process.cwd(), "templates", CoreConfig.template, "about", "page.content.tsx"));
const PageContent = dynamic<PageContentProps>(
  () => import(`@/templates/${CoreConfig.template}/about/page.content`),
  {ssr: true}
);

function Page() {
  if (!contentExists) {
    notFound();
  }
  const canonical = getCanonicalUrl("/about/");
  return (
    <>
      <PageContent
        coreConfig={CoreConfig}
        aboutConfig={AboutConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About " + CoreConfig.fullName,
        description,
        ...(canonical ? {url: canonical} : {}),
        mainEntity: {
          "@type": "Person",
          name: CoreConfig.fullName,
          image: AboutConfig.heroPicture,
        },
      }} />
    </>
  );
}

export default Page;
