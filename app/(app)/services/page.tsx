import dynamic from "next/dynamic";
import {CoreConfig, ServicesConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import StructuredData from "@/components/StructuredData";
import type {TModel as ServicesModel} from "@/configuration/services";

const PageContent = dynamic<{
  servicesConfig: ServicesModel;
}>(
  () => import(`@/templates/${CoreConfig.template}/services/page.content`),
  {ssr: true}
);

const description = stripHtmlTags(ServicesConfig.services.length
  ? ServicesConfig.services.map((service) => service.title).join(", ")
  : "Services offered by " + CoreConfig.fullName
).slice(0, 300);

export const metadata = createPageMetadata({
  title: "Services",
  description,
  path: "/services/",
  image: CoreConfig.favicon,
});

function Page() {
  const canonical = getCanonicalUrl("/services/");

  return (
    <>
      <PageContent
        servicesConfig={ServicesConfig}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Services",
        description,
        ...(canonical ? {url: canonical} : {}),
      }} />
    </>
  );
}

export default Page;
