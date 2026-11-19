import type { TModel as JourneyModel } from "@/configuration/journey";
import type { TModel as ProjectsModel } from "@/configuration/projects";

export interface PageContentProps {
  projectsConfig: ProjectsModel;
  journeyConfig: JourneyModel;
}
