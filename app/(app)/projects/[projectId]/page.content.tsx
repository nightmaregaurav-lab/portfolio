"use client"

import React from "react";
import {ArrowLeft, ArrowUpRight, ExternalLink, Image as ImageIcon} from "lucide-react";
import styles from "./page.module.css";
import {Badge} from "@/components/ui/badge";
import {buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import ImageLightbox from "@/components/ui/ImageLightbox";
import SmartLink from "@/components/ui/SmartLink";
import {cn} from "@/lib/utils";
import {TModel as ProjectModel} from "@/configuration/projects";
import {TModel as MilestoneModel} from "@/configuration/journey";
import {TModel as SkillModel} from "@/configuration/skills";

function PageContent(
  {project, milestone, skills}: {
    project: ProjectModel["projects"][number];
    milestone?: MilestoneModel["milestones"][number];
    skills: SkillModel["skills"];
  }
) {
  const links = (project.links || []);
  const images = (project.images || []).filter(Boolean);

  return (
    <main className={cn(styles.page, "bg-secondary")}>
      <div className={styles.pageInner}>
        <SmartLink href="/projects/" className={cn(buttonVariants({variant: "outline", size: "sm"}), styles.backLink)}>
          <ArrowLeft /> All projects
        </SmartLink>

        <article>
          <header className={styles.projectHeader}>
            {project.previewImage ? (
              <div className={styles.heroFrame}>
                <ImageLightbox
                  src={project.previewImage}
                  name={`${project.title} preview`}
                  trigger={<img src={project.previewImage} alt={`${project.title} preview`} />}
                />
              </div>
            ) : (
              <div className={cn(styles.heroFrame, styles.heroPlaceholder)}>
                <ImageIcon aria-hidden="true" />
              </div>
            )}
            <div className={styles.projectHeading}>
              <Badge variant="outline">Project</Badge>
              <h1>{project.title}</h1>
              <p className={styles.projectId}>Project ID: {project.id}</p>
            </div>
          </header>

          <div className={styles.detailLayout}>
            <div className={styles.mainColumn}>
              <section className={styles.contentSection} aria-labelledby="project-description-heading">
                <h2 id="project-description-heading">About this project</h2>
                <HtmlRenderer className={styles.projectDescription}>{project.description}</HtmlRenderer>
              </section>

              {!!images.length && (
                <section className={styles.contentSection} aria-labelledby="project-gallery-heading">
                  <div className={styles.sectionHeading}>
                    <h2 id="project-gallery-heading">More views</h2>
                    <span>{images.length} {images.length === 1 ? "image" : "images"}</span>
                  </div>
                  <div className={styles.imageGrid}>
                    {images.map((src, index) => (
                      <div className={styles.imageFrame} key={`${src}-${index}`}>
                        <ImageLightbox
                          src={src}
                          name={`${project.title} image ${index + 1}`}
                          trigger={<img src={src} alt={`${project.title}, image ${index + 1}`} />}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {!!project.keypoints?.length && (
                <section className={styles.contentSection} aria-labelledby="project-details-heading">
                  <h2 id="project-details-heading">Project details</h2>
                  <dl className={styles.keypointGrid}>
                    {project.keypoints.map((point, index) => (
                      <div className={styles.keypoint} key={`${point.title}-${index}`}>
                        <dt>{point.title}</dt>
                        <dd>{point.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </div>

            <aside className={styles.sideColumn}>
              <Card className={styles.sideCard}>
                <CardHeader>
                  <CardTitle><h2>Project links</h2></CardTitle>
                  <CardDescription>Explore the project elsewhere.</CardDescription>
                </CardHeader>
                <CardContent className={styles.linkList}>
                  {links.length ? links.map((link, index) => (
                    <SmartLink
                      key={`${link.url}-${index}`}
                      href={link.url}
                      external
                      className={cn("inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted", styles.projectLinkButton)}
                    >
                      <ExternalLink /> {link.name} <ArrowUpRight className={styles.externalArrow} />
                    </SmartLink>
                  )) : (
                    <p className={styles.mutedText}>No external links are listed for this project.</p>
                  )}
                </CardContent>
              </Card>

              <Card className={styles.sideCard}>
                <CardHeader>
                  <CardTitle><h2>Journey milestone</h2></CardTitle>
                  <CardDescription>The point in the journey associated with this project.</CardDescription>
                </CardHeader>
                <CardContent>
                  {milestone ? (
                    <div className={styles.milestone}>
                      {milestone.type && <Badge variant="secondary">{milestone.type}</Badge>}
                      <p>{milestone.title}</p>
                    </div>
                  ) : (
                    <p className={styles.mutedText}>No journey milestone is associated with this project.</p>
                  )}
                </CardContent>
              </Card>

              <Card className={styles.sideCard}>
                <CardHeader>
                  <CardTitle><h2>Related skills</h2></CardTitle>
                  <CardDescription>Skills connected to this project.</CardDescription>
                </CardHeader>
                <CardContent className={styles.skillList}>
                  {skills.length ? skills.map((skill) => (
                    <div className={styles.skill} key={skill.id}>
                      {skill.image && <img src={skill.image} alt="" className={styles.skillImage} />}
                      <div className={styles.skillText}>
                        <h3>{skill.title}</h3>
                        {skill.description && <HtmlRenderer className={styles.skillDescription}>{skill.description}</HtmlRenderer>}
                      </div>
                    </div>
                  )) : (
                    <p className={styles.mutedText}>No skills are linked to this project yet.</p>
                  )}
                </CardContent>
              </Card>

              {!!project.seoKeywords?.length && (
                <Card className={styles.sideCard}>
                  <CardHeader>
                    <CardTitle><h2>Search keywords</h2></CardTitle>
                  </CardHeader>
                  <CardContent className={styles.keywordList}>
                    {project.seoKeywords.map((keyword, index) => (
                      <Badge variant="outline" key={`${keyword}-${index}`}>{keyword}</Badge>
                    ))}
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}

export default PageContent;
