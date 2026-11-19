"use client";

import {useMemo, useState} from "react";
import {Grid2X2, List, Search} from "lucide-react";
import styles from "../page.module.css";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {useDebouncedState} from "@/hooks/useDebouncedState";
import type {TModel as JourneyModel} from "@/configuration/journey";
import type {TModel as ProjectsModel} from "@/configuration/projects";
import ProjectCard from "./ProjectCard";

function getSearchableProjectText(project: ProjectsModel["projects"][number]) {
  return [
    project.title,
    project.description,
    project.id,
    ...project.slugs.map(({slug}) => slug),
    ...(project.keypoints || []).flatMap(({title, value}) => [title, value]),
    ...(project.seoKeywords || []),
  ].join(" ").replaceAll(/<[^>]*>/g, " ").toLocaleLowerCase();
}

function ProjectsList({projects, milestonesById}: {projects: ProjectsModel["projects"]; milestonesById: Map<string, JourneyModel["milestones"][number]>}) {
  const {
    state: searchTerm,
    debouncedState: debouncedSearchTerm,
    setState: setSearchTerm
  } = useDebouncedState("", 300);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const visibleProjects = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLocaleLowerCase();
    if (!query) return projects;
    return projects.filter((project) => getSearchableProjectText(project).includes(query));
  }, [projects, debouncedSearchTerm]);

  return (
    <>
      <div className={styles.searchAndActionsStrip}>
        <div className={styles.searchBox}>
          <Search size={17} aria-hidden="true" />
          <Input
            type="search"
            aria-label="Search projects"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className={styles.quickActionButtons} role="group" aria-label="Project layout">
          <Button
            size="icon-sm"
            type="button"
            variant={viewMode === "grid" ? "secondary" : "outline"}
            onClick={() => setViewMode("grid")}
            aria-label="Switch to grid view"
            aria-pressed={viewMode === "grid"}
            className="cursor-pointer"
          >
            <Grid2X2 />
          </Button>
          <Button
            size="icon-sm"
            type="button"
            variant={viewMode === "list" ? "secondary" : "outline"}
            onClick={() => setViewMode("list")}
            aria-label="Switch to list view"
            aria-pressed={viewMode === "list"}
            className="cursor-pointer"
          >
            <List />
          </Button>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"} shown
        {searchTerm.trim() ? " for \"" + searchTerm.trim() + "\"" : ""}
      </div>

      {visibleProjects.length > 0 ? (
        <div className={cn(styles.projectGrid, viewMode === "list" && styles.listView)}>
          {visibleProjects.map((project) => (
            <ProjectCard project={project} milestonesById={milestonesById} key={project.id} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState} role="status">
          {searchTerm.trim()
            ? "No projects match \"" + searchTerm.trim() + "\"."
            : "No projects to show yet."}
        </div>
      )}
    </>
  );
}

export default ProjectsList;
