import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import ResponsiveImage from "@/components/ui/ResponsiveImage";
import SmartLink from "@/components/ui/SmartLink";
import type { TModel as JourneyModel } from "@/configuration/journey";
import type { TModel as ProjectsModel } from "@/configuration/projects";
import { getActiveSlug } from "@/lib/slugs";
import styles from "../page.module.css";

type MilestoneType = JourneyModel["milestones"][number]["type"];

function getProjectMilestoneType(
  project: ProjectsModel["projects"][number],
  milestonesById: Map<string, JourneyModel["milestones"][number]>,
): MilestoneType {
  if (!project.milestoneId) return "Personal";
  return milestonesById.get(project.milestoneId)?.type || "Personal";
}

function ProjectCard({
  project,
  milestonesById,
}: {
  project: ProjectsModel["projects"][number];
  milestonesById: Map<string, JourneyModel["milestones"][number]>;
}) {
  return (
    <SmartLink
      href={`/projects/${getActiveSlug(project.slugs)}/`}
      className={styles.projectLink}
      key={project.id}
      aria-label={`View ${project.title}`}
    >
      <Card
        className={styles.projectCard}
        data-type={getProjectMilestoneType(project, milestonesById)}
      >
        <div className={styles.projectCover}>
          {project.previewImage ? (
            <ResponsiveImage
              src={project.previewImage}
              alt={`${project.title} preview`}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <ImageIcon aria-hidden="true" />
          )}
        </div>
        <CardHeader className={styles.projectCardHeader}>
          <div className={styles.projectTitleRow}>
            <CardTitle className={styles.projectTitle}>
              <h2>{project.title}</h2>
            </CardTitle>
            <ArrowRight
              size={18}
              aria-hidden="true"
              className={styles.projectArrow}
            />
          </div>
        </CardHeader>
        <CardContent className={styles.projectCardContent}>
          <HtmlRenderer className={styles.projectDescription}>
            {project.description}
          </HtmlRenderer>
          {!!project.seoKeywords?.length && (
            <div className={styles.projectBadges}>
              {project.seoKeywords.slice(0, 3).map((keyword, index) => (
                <Badge variant="secondary" key={`${keyword}-${index}`}>
                  {keyword}
                </Badge>
              ))}
              {project.seoKeywords.length > 3 && (
                <Badge variant="outline">
                  +{project.seoKeywords.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </SmartLink>
  );
}

export default ProjectCard;
