import HtmlRenderer from "@/components/ui/HtmlRenderer";
import ProjectsList from "./components/ProjectsList";
import styles from "./page.module.css";
import type {PageContentProps} from "@/app/(app)/projects/page.types";

function PageContent({projectsConfig, journeyConfig}: PageContentProps) {
  const projects = projectsConfig.projects || [];
  const milestonesById = new Map((journeyConfig.milestones || []).map((milestone) => [milestone.id, milestone]));

  return (
    <main className={styles.page} aria-label="Projects">
      <h1 className={styles.pageHeader}>Projects</h1>
      <HtmlRenderer className={styles.pageText}>{projectsConfig.summary}</HtmlRenderer>

      <section className={styles.pageContent} aria-label="Project portfolio">
        <ProjectsList projects={projects} milestonesById={milestonesById} />
      </section>
    </main>
  );
}

export default PageContent;
