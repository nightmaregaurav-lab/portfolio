import type React from "react";
import {join} from "node:path";
import dynamic from "next/dynamic";
import {CoreConfig, NavigationConfig, QuickLinksConfig} from "@/configuration";
import type {LayoutContentProps} from "@/app/(app)/layout.types";
import {getFileType, Templates} from "@/lib/templates";

const templateType = getFileType(join(process.cwd(), `templates/${CoreConfig.template}/layout.content.tsx`));
const LayoutContent = templateType === Templates.Client
  ? dynamic<LayoutContentProps>(
    () => import(`@/templates/${CoreConfig.template}/layout.content`),
    {ssr: true}
  )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/layout.content`)).default as React.ComponentType<LayoutContentProps>)
    : null;

function Layout({children}: LayoutProps<"/">) {
  return (
    <>
      {LayoutContent ? <LayoutContent
        coreConfig={CoreConfig}
        navigationConfig={NavigationConfig}
        quickLinksConfig={QuickLinksConfig}
      >
        {children}
      </LayoutContent> : children}
    </>
  );
}

export default Layout;

