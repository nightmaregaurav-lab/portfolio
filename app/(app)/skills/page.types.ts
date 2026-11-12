import type {TModel as SkillsModel} from "@/configuration/skills";
import type {TModel as JourneyModel} from "@/configuration/journey";
import type {TModel as ProjectsModel} from "@/configuration/projects";

export interface PageContentProps {
  skillsConfig: SkillsModel;
  journeyConfig: JourneyModel;
  projectsConfig: ProjectsModel;
}
