import type {TModel as CoreModel} from "@/configuration/core";
import type {TModel as HomeModel} from "@/configuration/home";

export interface PageContentProps {
  coreConfig: CoreModel;
  homeConfig: HomeModel;
}
