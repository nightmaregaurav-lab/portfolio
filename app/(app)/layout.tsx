import {join} from "node:path";
import {existsSync} from "node:fs";
import dynamic from "next/dynamic";
import {CoreConfig, LeftPanelConfig, QuickLinksConfig} from "@/configuration";
import type {LayoutContentProps} from "@/app/(app)/layout.types";

const contentExists = existsSync(join(process.cwd(), "templates", CoreConfig.template, "layout.content.tsx"));
const LayoutContent = contentExists ? dynamic<LayoutContentProps>(
  () => import(`@/templates/${CoreConfig.template}/layout.content`),
  {ssr: true}
) : null;

function Layout({children}: LayoutProps<"/">) {
  return (
    <>
      {LayoutContent ? <LayoutContent
        coreConfig={CoreConfig}
        leftPanelConfig={LeftPanelConfig}
        quickLinksConfig={QuickLinksConfig}
      >
        {children}
      </LayoutContent> : children}
    </>
  );
}

export default Layout;

