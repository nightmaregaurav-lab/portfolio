import dynamic from "next/dynamic";
import StructuredData from "@/components/StructuredData";
import {AboutConfig, CoreConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import type {TModel as CoreModel} from "@/configuration/core";
import type {TModel as AboutModel} from "@/configuration/about";

const description = stripHtmlTags(AboutConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "About",
  description,
  path: "/about/",
  image: AboutConfig.heroPicture
});

const PageContent = dynamic<{
  coreConfig: CoreModel;
  aboutConfig: AboutModel;
}>(
  () => import(`@/templates/${CoreConfig.template}/about/page.content`),
  {ssr: true}
);

function Page() {
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
