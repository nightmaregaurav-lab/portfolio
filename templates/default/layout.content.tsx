"use client";

import type { LayoutContentProps } from "@/app/(app)/layout.types";
import GoToTopButton from "@/components/ui/GoToTopButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import LeftPanel from "@/templates/default/LeftPanel";
import styles from "./layout.module.css";

export default function ShellTemplate({
  children,
  coreConfig,
  navigationConfig,
  quickLinksConfig,
}: LayoutContentProps) {
  return (
    <SidebarProvider defaultOpen={false} data-template={coreConfig.template}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <LeftPanel
        coreConfig={coreConfig}
        navigationConfig={navigationConfig}
        quickLinksConfig={quickLinksConfig}
      />
      <div
        id="main-content"
        tabIndex={-1}
        className={styles.mainLandmark}
        role="main"
        aria-label="Main content"
      >
        {children}
      </div>
      <GoToTopButton />
    </SidebarProvider>
  );
}
