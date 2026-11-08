"use client";

import React from "react";
import {ArrowUpRight, Brain, Compass} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import SmartLink from "@/components/ui/SmartLink";
import type {TModel as SkillsModel} from "@/configuration/skills";
import styles from "./page.module.css";

function PageContent(
  {skillsConfig}: {
    skillsConfig: SkillsModel
  }
) {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <div>
          <h1 className={styles.pageHeader}>Skills</h1>
          <HtmlRenderer className={styles.summary}>{skillsConfig.summary}</HtmlRenderer>
        </div>
      </header>

      {skillsConfig.skills && skillsConfig.skills.length > 0 ? (
        <section className={styles.skillGrid} aria-label="Skills and capabilities">
          {skillsConfig.skills.map((skill, index) => (
            <Card className={styles.skillCard} key={skill.id}>
              <div className={styles.skillImage}>
                <img src={skill.image} alt="" loading={index > 1 ? "lazy" : "eager"}/>
                <span className={styles.skillIndex} aria-hidden="true">0{index + 1}</span>
              </div>
              <CardHeader className={styles.skillHeader}>
                <CardTitle className={styles.skillTitle}>{skill.title}</CardTitle>
                <HtmlRenderer className={styles.skillDescription}>{skill.description}</HtmlRenderer>
              </CardHeader>
              {(skill.associatedMilestoneIds.length > 0 || skill.associatedProjectIds.length > 0) && (
                <CardContent className={styles.evidence}>
                  <div className={styles.evidenceHeading}>
                    <Compass size={15} aria-hidden="true"/>
                    <span>Related work</span>
                  </div>
                  <div className={styles.badges}>
                    {skill.associatedProjectIds.slice(0, 3).map((id) => <Badge variant="secondary" key={"project-" + id}>Project #{id}</Badge>)}
                    {skill.associatedMilestoneIds.slice(0, 3).map((id) => <Badge variant="outline" key={"milestone-" + id}>Milestone #{id}</Badge>)}
                  </div>
                </CardContent>
              )}
              <SmartLink className={styles.skillLink} href={"/projects/"}>
                See it in practice <ArrowUpRight size={15} aria-hidden="true"/>
              </SmartLink>
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
