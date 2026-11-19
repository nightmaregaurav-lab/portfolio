import type { TModel as AboutModel } from "@/configuration/about";
import type { TModel as CoreModel } from "@/configuration/core";

export interface PageContentProps {
  coreConfig: CoreModel;
  aboutConfig: AboutModel;
}
