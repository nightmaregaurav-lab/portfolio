import {readConfigurationFromFile} from "@/configuration/configurationFiles";

import type {TOutput as AboutOutput} from "@/configuration/about";
import {buildSchema as aboutSchema} from "@/configuration/about";
export const AboutConfig: AboutOutput = aboutSchema.parse(readConfigurationFromFile("about.json")) as AboutOutput;

import type {TOutput as BlogsOutput} from "@/configuration/blogs";
import {buildSchema as blogsSchema} from "@/configuration/blogs";
export const BlogsConfig: BlogsOutput = blogsSchema.parse(readConfigurationFromFile("blogs.json")) as BlogsOutput;

import type {TOutput as CoreOutput} from "@/configuration/core";
import {buildSchema as coreSchema} from "@/configuration/core";
export const CoreConfig: CoreOutput = coreSchema.parse(readConfigurationFromFile("core.json")) as CoreOutput;

import type {TOutput as GalleryOutput} from "@/configuration/gallery";
import {buildSchema as gallerySchema} from "@/configuration/gallery";
export const GalleryConfig: GalleryOutput = gallerySchema.parse(readConfigurationFromFile("gallery.json")) as GalleryOutput;

import type {TOutput as HomeOutput} from "@/configuration/home";
import {buildSchema as homeSchema} from "@/configuration/home";
export const HomeConfig: HomeOutput = homeSchema.parse(readConfigurationFromFile("home.json")) as HomeOutput;

import type {TOutput as JourneyOutput} from "@/configuration/journey";
import {buildSchema as journeySchema} from "@/configuration/journey";
export const JourneyConfig: JourneyOutput = journeySchema.parse(readConfigurationFromFile("journey.json")) as JourneyOutput;

import type {TOutput as NavigationOutput} from "@/configuration/navigation";
import {buildSchema as navigationSchema} from "@/configuration/navigation";
export const NavigationConfig: NavigationOutput = navigationSchema.parse(readConfigurationFromFile("navigation.json")) as NavigationOutput;

import type {TOutput as ProjectsOutput} from "@/configuration/projects";
import {buildSchema as projectsSchema} from "@/configuration/projects";
export const ProjectsConfig: ProjectsOutput = projectsSchema.parse(readConfigurationFromFile("projects.json")) as ProjectsOutput;

import type {TOutput as QuickLinksOutput} from "@/configuration/quickLinks";
import {buildSchema as quickLinksSchema} from "@/configuration/quickLinks";
export const QuickLinksConfig: QuickLinksOutput = quickLinksSchema.parse(readConfigurationFromFile("quick-links.json")) as QuickLinksOutput;

import type {TOutput as ServicesOutput} from "@/configuration/services";
import {buildSchema as servicesSchema} from "@/configuration/services";
export const ServicesConfig: ServicesOutput = servicesSchema.parse(readConfigurationFromFile("services.json")) as ServicesOutput;

import type {TOutput as SkillsOutput} from "@/configuration/skills";
import {buildSchema as skillsSchema} from "@/configuration/skills";
export const SkillsConfig: SkillsOutput = skillsSchema.parse(readConfigurationFromFile("skills.json")) as SkillsOutput;

import type {TOutput as TestimonialsOutput} from "@/configuration/testimonials";
import {buildSchema as testimonialsSchema} from "@/configuration/testimonials";
export const TestimonialsConfig: TestimonialsOutput = testimonialsSchema.parse(readConfigurationFromFile("testimonials.json")) as TestimonialsOutput;
