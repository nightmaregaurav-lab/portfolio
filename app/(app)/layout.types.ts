import React from "react";
import type {TModel as CoreModel} from "@/configuration/core";
import type {TModel as LeftPanelModel} from "@/configuration/leftPanel";
import type {TModel as QuickLinksModel} from "@/configuration/quickLinks";

export interface LayoutContentProps {
  children: React.ReactNode;
  coreConfig: CoreModel;
  leftPanelConfig: LeftPanelModel;
  quickLinksConfig: QuickLinksModel;
}
