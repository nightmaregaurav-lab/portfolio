import type {TModel as ProjectsModel} from "@/configuration/projects";
import type {TModel as JourneyModel} from "@/configuration/journey";
import type {TModel as SkillsModel} from "@/configuration/skills";

export interface PageContentProps {
  project: ProjectsModel["projects"][number];
  milestone?: JourneyModel["milestones"][number];
  skills: SkillsModel["skills"];
}
