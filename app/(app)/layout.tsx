import type React from "react";
import {Suspense} from "react";
import {join} from "node:path";
import dynamic from "next/dynamic";
import {CoreConfig, NavigationConfig, QuickLinksConfig} from "@/configuration";
import type {LayoutContentProps} from "@/app/(app)/layout.types";
import {getFileType, Templates} from "@/lib/templates";
import {Spinner} from "@/components/ui/spinner";

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
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading layout">
        <Spinner className="size-6" />
      </div>
    }>
      {LayoutContent ? <LayoutContent
        coreConfig={CoreConfig}
        navigationConfig={NavigationConfig}
        quickLinksConfig={QuickLinksConfig}
      >
        {children}
      </LayoutContent> : children}
    </Suspense>
  );
}

export default Layout;

