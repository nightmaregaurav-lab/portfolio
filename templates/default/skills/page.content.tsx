"use client";

import React from "react";
import {Brain, Compass} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import SmartLink from "@/components/ui/SmartLink";
import styles from "./page.module.css";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import type {PageContentProps} from "@/app/(app)/skills/page.types";
import type {TModel as SkillsModel} from "@/configuration/skills";
import type {TModel as JourneyModel} from "@/configuration/journey";
import type {TModel as ProjectsModel} from "@/configuration/projects";

function getSkillMilestoneType(skill: SkillsModel["skills"][number], journeyConfig: JourneyModel): JourneyModel["milestones"][number]["type"] {
  const relatedMilestones = skill.associatedMilestoneIds
    .map((id) => journeyConfig.milestones.find((milestone) => milestone.id === id))
    .filter(Boolean) as JourneyModel["milestones"][number][];

  if (relatedMilestones.length === 0) return "Personal";
  if (relatedMilestones.length === 1) return relatedMilestones[0].type;

  relatedMilestones.sort((a, b) => b.start.localeCompare(a.start));
  return relatedMilestones[0].type;
}

function getRelatedWorks(skill: SkillsModel["skills"][number], journeyConfig: JourneyModel, projectsConfig: ProjectsModel) {
  const relatedProjects = skill.associatedProjectIds.map((id) => projectsConfig.projects.find((project) => project.id === id)).filter(Boolean);
  const relatedMilestones = skill.associatedMilestoneIds.map((id) => journeyConfig.milestones.find((milestone) => milestone.id === id)).filter(Boolean);

  const relatedWorks: {label: string, url: string}[] = [];
  relatedProjects.forEach((project) => {
    if (project) {
      relatedWorks.push({
        label: project.title,
        url: `/projects/?keyword=${encodeURIComponent(project.slugs.find((slug) => slug.isActive)?.slug || project.title)}`,
      });
    }
  });
  relatedMilestones.forEach((milestone) => {
    if (milestone) {
      relatedWorks.push({
        label: milestone.title,
        url: `/journey/#${encodeURIComponent(milestone.id)}`,
      });
    }
  });
  return relatedWorks;
}

function PageContent({skillsConfig, journeyConfig, projectsConfig}: PageContentProps) {
  return (
    <main className={styles.page} aria-label="Skills">
      <header className={styles.intro}>
        <div>
          <h1 className={styles.pageHeader}>Skills</h1>
          <HtmlRenderer className={styles.summary}>{skillsConfig.summary}</HtmlRenderer>
        </div>
      </header>

      {skillsConfig.skills && skillsConfig.skills.length > 0 ? (
        <section className={styles.skillGrid} aria-label="Skills and capabilities">
          {skillsConfig.skills.map((skill, index) => (
            <Card className={styles.skillCard} data-type={getSkillMilestoneType(skill, journeyConfig)} key={skill.id}>
              <div className={styles.skillImage}>
                <img src={skill.image} alt={`${skill.title} icon`} loading={index > 1 ? "lazy" : "eager"}/>
                <span className={styles.skillIndex} aria-hidden="true">0{index + 1}</span>
              </div>
              <CardHeader className={styles.skillHeader}>
                <CardTitle className={styles.skillTitle}>{skill.title}</CardTitle>
                <HtmlRenderer className={styles.skillDescription}>{skill.description}</HtmlRenderer>
              </CardHeader>
              {getRelatedWorks(skill, journeyConfig, projectsConfig).length > 0 && (
                <CardContent className={styles.evidence}>
                  <div className={styles.evidenceHeading}>
                    <Compass size={15} aria-hidden="true"/>
                    <span>Related work</span>
                  </div>
                  <div className={styles.badges}>
                    {getRelatedWorks(skill, journeyConfig, projectsConfig).slice(0, 3).map((work) =>
                      <SmartLink href={work.url} aria-label={`View ${work.label}`}><Badge variant="secondary" className={"truncate"} key={work.label}>{work.label}</Badge></SmartLink>
                    )}
                    <Tooltip>
                      <TooltipTrigger>
                        {getRelatedWorks(skill, journeyConfig, projectsConfig).length > 3 &&
                          <Badge variant="secondary" className={"truncate"}>+{getRelatedWorks(skill, journeyConfig, projectsConfig).length - 3} more</Badge>
                        }
                      </TooltipTrigger>
                      <TooltipContent className={"flex flex-col w-auto"}>
                        {getRelatedWorks(skill, journeyConfig, projectsConfig).slice(3).map((work) =>
                          <SmartLink href={work.url} aria-label={`View ${work.label}`}><Badge variant="secondary" className={"truncate"} key={work.label}>{work.label}</Badge></SmartLink>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </section>
      ) : (
        <section className={styles.emptyState} aria-label="Skills">
          <Brain size={26} aria-hidden="true"/>
          <h2>This page is being built.</h2>
          <p>Skills and capabilities will be added here soon. Please check back later.</p>
        </section>
      )}
    </main>
  );
}

export default PageContent;
