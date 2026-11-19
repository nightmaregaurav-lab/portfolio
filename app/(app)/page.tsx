import type React from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import {CoreConfig, HomeConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getSiteName} from "@/lib/pageMetadata";
import {getTemplateType, Templates} from "@/lib/templates";
import type {PageContentProps} from "./page.types";

const templateType = getTemplateType("home");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
    () => import(`@/templates/${CoreConfig.template}/home/page.content`),
    {ssr: true}
  )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/home/page.content`)).default as React.ComponentType<PageContentProps>)
    : null;

export const metadata = createPageMetadata({
  title: getSiteName(),
  description: CoreConfig.seoDescription || HomeConfig.bio,
  path: "/",
  image: HomeConfig.coverPicture || NavigationConfig.profilePicture || CoreConfig.favicon,
  keywords: CoreConfig.seoKeywords,
});

function Page() {
  if (!PageContent) {
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
