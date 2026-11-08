"use client"

import React, {useMemo, useState} from "react";
import SmartLink from "@/components/ui/SmartLink";
import {ArrowRight, Grid2X2, Image as ImageIcon, List, Search} from "lucide-react";
import styles from "./page.module.css";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {cn} from "@/lib/utils";
import type {TModel as ProjectsModel} from "@/configuration/projects";
import {getActiveSlug} from "@/lib/slugs";

function getSearchableProjectText(project: ProjectsModel["projects"][number]) {
  return [
    project.title,
    project.description,
    project.id,
    ...(project.keypoints || []).flatMap(({title, value}) => [title, value]),
    ...(project.seoKeywords || []),
  ].join(" ").replaceAll(/<[^>]*>/g, " ").toLocaleLowerCase();
}

function PageContent(
  {projectsConfig}: {
    projectsConfig: ProjectsModel
  }
) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const projects = projectsConfig.projects || [];

  const visibleProjects = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    if (!query) return projects;
    return projects.filter((project) => getSearchableProjectText(project).includes(query));
  }, [projects, searchTerm]);

  return (
    <main className={cn(styles.page)}>
      <h1 className={styles.pageHeader}>Projects</h1>
      <HtmlRenderer className={styles.pageText}>{projectsConfig.summary}</HtmlRenderer>

      <section className={styles.pageContent} aria-label="Project portfolio">
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
          {searchTerm.trim() ? " for “" + searchTerm.trim() + "”" : ""}
        </div>

        {visibleProjects.length > 0 ? (
          <div className={cn(styles.projectGrid, viewMode === "list" && styles.listView)}>
            {visibleProjects.map((project) => (
              <SmartLink
                href={"/projects/" + getActiveSlug(project.slugs) + "/"}
                className={styles.projectLink}
                key={project.id}
              >
                <Card className={styles.projectCard}>
                  <div className={styles.projectCover}>
                    {project.previewImage ? (
                      <img src={project.previewImage} alt={project.title + " preview"} />
                    ) : (
                      <ImageIcon aria-hidden="true" />
                    )}
                  </div>
                  <CardHeader className={styles.projectCardHeader}>
                    <div className={styles.projectTitleRow}>
                      <CardTitle className={styles.projectTitle}>
                        <h2>{project.title}</h2>
                      </CardTitle>
                      <ArrowRight size={18} aria-hidden="true" className={styles.projectArrow} />
                    </div>
                    <CardDescription className={styles.projectId}>Project #{project.id}</CardDescription>
                  </CardHeader>
                  <CardContent className={styles.projectCardContent}>
                    <HtmlRenderer className={styles.projectDescription}>{project.description}</HtmlRenderer>
                    {!!project.keypoints?.length && (
                      <div className={styles.projectBadges}>
                        {project.keypoints.slice(0, 3).map((point, index) => (
                          <Badge variant="secondary" key={point.title + "-" + index}>{point.title}: {point.value}</Badge>
                        ))}
                        {project.keypoints.length > 3 && (
                          <Badge variant="outline">+{project.keypoints.length - 3} details</Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </SmartLink>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState} role="status">
            {searchTerm.trim()
              ? "No projects match “" + searchTerm.trim() + "”."
              : "No projects to show yet."}
          </div>
        )}
      </section>
    </main>
  );
}

export default PageContent;
