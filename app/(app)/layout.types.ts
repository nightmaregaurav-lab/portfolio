import React from "react";
import type {TModel as CoreModel} from "@/configuration/core";
import type {TModel as NavigationModel} from "@/configuration/navigation";
import type {TModel as QuickLinksModel} from "@/configuration/quickLinks";

export interface LayoutContentProps {
  children: React.ReactNode;
  coreConfig: CoreModel;
  navigationConfig: NavigationModel;
  quickLinksConfig: QuickLinksModel;
}
