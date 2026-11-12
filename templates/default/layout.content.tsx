"use client"

import React from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import GoToTopButton from "@/components/ui/GoToTopButton";
import type {LayoutContentProps} from "@/app/(app)/layout.types";
import styles from "./layout.module.css";
import LeftPanel from "@/templates/default/LeftPanel";

export default function ShellTemplate({children, coreConfig, leftPanelConfig, quickLinksConfig}: LayoutContentProps) {
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
      <div id="main-content" tabIndex={-1} className={styles.mainLandmark} role="main" aria-label="Main content">
        {children}
      </div>
      <GoToTopButton />
    </SidebarProvider>
  );
}
