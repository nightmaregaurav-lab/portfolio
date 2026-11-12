import {join} from "node:path";
import {existsSync} from "node:fs";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import {CoreConfig, HomeConfig} from "@/configuration";
import {createPageMetadata, getSiteName} from "@/lib/pageMetadata";
import type {PageContentProps} from "./page.types";

export const metadata = createPageMetadata({
  title: getSiteName(),
  description: CoreConfig.seoDescription || HomeConfig.bio,
  path: "/",
  image: HomeConfig.coverPicture || CoreConfig.favicon,
  keywords: CoreConfig.seoKeywords,
});

const contentExists = existsSync(join(process.cwd(), "templates", CoreConfig.template, "home", "page.content.tsx"));
const PageContent = dynamic<PageContentProps>(
  () => import(`@/templates/${CoreConfig.template}/home/page.content`),
  {ssr: true}
);

function Page() {
  if (!contentExists) {
    notFound();
  }
  return (
    <PageContent
      coreConfig={CoreConfig}
      homeConfig={HomeConfig}
    />
  );
}

export default Page;
