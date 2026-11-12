import type {TModel as CoreModel} from "@/configuration/core";
import type {TModel as AboutModel} from "@/configuration/about";

export interface PageContentProps {
  coreConfig: CoreModel;
  aboutConfig: AboutModel;
}
