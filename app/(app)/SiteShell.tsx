"use client"

import React from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import GoToTopButton from "@/components/ui/GoToTopButton";
import LeftPanel from "@/app/(app)/LeftPanel";
import type {TModel as CoreModel} from "@/configuration/core";
import type {TModel as LeftPanelModel} from "@/configuration/leftPanel";
import type {TModel as QuickLinksModel} from "@/configuration/quickLinks";
import styles from "./SiteShell.module.css";

type SiteShellProps = {
  children: React.ReactNode;
  coreConfig: CoreModel;
  leftPanelConfig: LeftPanelModel;
  quickLinksConfig: QuickLinksModel;
};

export default function SiteShell({children, coreConfig, leftPanelConfig, quickLinksConfig}: SiteShellProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <LeftPanel
        coreConfig={coreConfig}
        leftPanelConfig={leftPanelConfig}
        quickLinksConfig={quickLinksConfig}
      />
      <div id="main-content" tabIndex={-1} className={styles.mainLandmark}>
        {children}
      </div>
      <GoToTopButton />
    </SidebarProvider>
  );
}
