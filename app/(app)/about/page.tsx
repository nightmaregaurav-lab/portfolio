import StructuredData from "@/components/StructuredData";
import {AboutConfig, CoreConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import PageContent from "./page.content";

const description = stripHtmlTags(AboutConfig.summary).slice(0, 300);

export const metadata = createPageMetadata({
  title: "About",
  description,
  path: "/about/",
  image: AboutConfig.heroPicture
});

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
