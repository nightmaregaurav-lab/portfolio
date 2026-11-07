import {migrateConfiguration} from "@/migrations/configurationMigrationManager";
import {readConfigurationFile} from "@/configuration/configurationFiles";

import type {TOutput as AboutOutput} from "@/configuration/about";
import {buildSchema as aboutSchema} from "@/configuration/about";
export const AboutConfig: AboutOutput = aboutSchema.parse(migrateConfiguration("about", readConfigurationFile("about.json")).configuration) as AboutOutput;

import type {TOutput as BlogsOutput} from "@/configuration/blogs";
import {buildSchema as blogsSchema} from "@/configuration/blogs";
export const BlogsConfig: BlogsOutput = blogsSchema.parse(migrateConfiguration("blogs", readConfigurationFile("blogs.json")).configuration) as BlogsOutput;

import type {TOutput as CoreOutput} from "@/configuration/core";
import {buildSchema as coreSchema} from "@/configuration/core";
export const CoreConfig: CoreOutput = coreSchema.parse(migrateConfiguration("core", readConfigurationFile("core.json")).configuration) as CoreOutput;

import type {TOutput as GalleryOutput} from "@/configuration/gallery";
import {buildSchema as gallerySchema} from "@/configuration/gallery";
export const GalleryConfig: GalleryOutput = gallerySchema.parse(migrateConfiguration("gallery", readConfigurationFile("gallery.json")).configuration) as GalleryOutput;

import type {TOutput as HomeOutput} from "@/configuration/home";
import {buildSchema as homeSchema} from "@/configuration/home";
export const HomeConfig: HomeOutput = homeSchema.parse(migrateConfiguration("home", readConfigurationFile("home.json")).configuration) as HomeOutput;

import type {TOutput as JourneyOutput} from "@/configuration/journey";
import {buildSchema as journeySchema} from "@/configuration/journey";
export const JourneyConfig: JourneyOutput = journeySchema.parse(migrateConfiguration("journey", readConfigurationFile("journey.json")).configuration) as JourneyOutput;

import type {TOutput as LeftPanelOutput} from "@/configuration/leftPanel";
import {buildSchema as leftPanelSchema} from "@/configuration/leftPanel";
export const LeftPanelConfig: LeftPanelOutput = leftPanelSchema.parse(migrateConfiguration("leftPanel", readConfigurationFile("left-panel.json")).configuration) as LeftPanelOutput;

import type {TOutput as ProjectsOutput} from "@/configuration/projects";
import {buildSchema as projectsSchema} from "@/configuration/projects";
export const ProjectsConfig: ProjectsOutput = projectsSchema.parse(migrateConfiguration("projects", readConfigurationFile("projects.json")).configuration) as ProjectsOutput;

import type {TOutput as QuickLinksOutput} from "@/configuration/quickLinks";
import {buildSchema as quickLinksSchema} from "@/configuration/quickLinks";
export const QuickLinksConfig: QuickLinksOutput = quickLinksSchema.parse(migrateConfiguration("quickLinks", readConfigurationFile("quick-links.json")).configuration) as QuickLinksOutput;

import type {TOutput as ServicesOutput} from "@/configuration/services";
import {buildSchema as servicesSchema} from "@/configuration/services";
export const ServicesConfig: ServicesOutput = servicesSchema.parse(migrateConfiguration("services", readConfigurationFile("services.json")).configuration) as ServicesOutput;

import type {TOutput as SkillsOutput} from "@/configuration/skills";
import {buildSchema as skillsSchema} from "@/configuration/skills";
export const SkillsConfig: SkillsOutput = skillsSchema.parse(migrateConfiguration("skills", readConfigurationFile("skills.json")).configuration) as SkillsOutput;

import type {TOutput as TestimonialsOutput} from "@/configuration/testimonials";
import {buildSchema as testimonialsSchema} from "@/configuration/testimonials";
export const TestimonialsConfig: TestimonialsOutput = testimonialsSchema.parse(migrateConfiguration("testimonials", readConfigurationFile("testimonials.json")).configuration) as TestimonialsOutput;
