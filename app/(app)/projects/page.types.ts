import type {TModel as ProjectsModel} from "@/configuration/projects";
import type {TModel as JourneyModel} from "@/configuration/journey";

export interface PageContentProps {
  projectsConfig: ProjectsModel;
  journeyConfig: JourneyModel;
}
