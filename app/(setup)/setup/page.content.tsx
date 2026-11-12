"use client"

import React from 'react';
import styles from "./page.module.css";
import ConfigurationGroupCard from "@/components/ui/ConfigurationGroupCard";
import {
  AlignJustify,
  Brain,
  BriefcaseBusiness,
  FolderOpenDot,
  House, Images, Link,
  MessageCircleMore,
  Milestone, NotebookPen,
  User,
  Wrench
} from "lucide-react";

function PageContent() {
  return (
    <div className={styles.page}>
      <div className={"w-full max-w-6xl"}>
        <div className={"max-w-2xl"}>
          <h1 className={"text-3xl font-semibold tracking-tight sm:text-4xl"}>Website setup</h1>
          <p className={"mt-3 text-base text-muted-foreground"}>
            Configure each part of your portfolio using focused forms. Your changes are saved to the connected repository.
          </p>
        </div>
      </div>
      <div className={styles.cards}>
        <ConfigurationGroupCard
          icon={<Wrench/>}
          title="Core"
          description="Set core configuration values for the website."
          pagePath="/setup/core"
        />
        <ConfigurationGroupCard
          icon={<House/>}
          title="Home"
          description="Customize the Landing page."
          pagePath="/setup/home"
        />
        <ConfigurationGroupCard
          icon={<AlignJustify/>}
          title="Navigation"
          description="Customize the navigation panel."
          pagePath="/setup/navigation"
        />
        <ConfigurationGroupCard
          icon={<Link/>}
          title="Quick Links"
          description="Manage links to show on the left panel."
          pagePath="/setup/quick-links"
        />
        <ConfigurationGroupCard
          icon={<User/>}
          title="About"
          description="Customize the About page."
          pagePath="/setup/about"
        />
        <ConfigurationGroupCard
          icon={<Milestone/>}
          title="Journey"
          description="Manage your journey and milestones."
          pagePath="/setup/journey"
        />
        <ConfigurationGroupCard
          icon={<FolderOpenDot/>}
          title="Projects"
          description="Manage your projects and related data."
          pagePath="/setup/projects"
        />
        <ConfigurationGroupCard
          icon={<Brain/>}
          title="Skills"
          description="Manage skills and related data."
          pagePath="/setup/skills"
        />
        <ConfigurationGroupCard
          icon={<BriefcaseBusiness/>}
          title="Services"
          description="Manage services you offer."
          pagePath="/setup/services"
        />
        <ConfigurationGroupCard
          icon={<MessageCircleMore/>}
          title="Testimonials"
          description="Manage testimonials."
          pagePath="/setup/testimonials"
        />
        <ConfigurationGroupCard
          icon={<Images/>}
          title="Gallery"
          description="Manage gallery photos."
          pagePath="/setup/gallery"
        />
        <ConfigurationGroupCard
          icon={<NotebookPen/>}
          title="Blog"
          description="Write blog posts."
          pagePath="/setup/blogs"
        />
      </div>
    </div>
  );
}

export default PageContent;
