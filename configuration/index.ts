import aboutJson from "@/public/config/about.json";
import type {Model as AboutModel} from "@/configuration/about";
import {schema as aboutSchema} from "@/configuration/about";
export const AboutConfig: AboutModel = aboutSchema.parse(aboutJson);

import blogsJson from "@/public/config/blogs.json";
import type {Model as BlogsModel} from "@/configuration/blogs";
import {schema as blogsSchema} from "@/configuration/blogs";
export const BlogsConfig: BlogsModel = blogsSchema.parse(blogsJson);

import coreJson from "@/public/config/core.json";
import type {Model as CoreModel} from "@/configuration/core";
import {schema as coreSchema} from "@/configuration/core";
export const CoreConfig: CoreModel = coreSchema.parse(coreJson);

import galleryJson from "@/public/config/gallery.json";
import type {Model as GalleryModel} from "@/configuration/gallery";
import {schema as gallerySchema} from "@/configuration/gallery";
export const GalleryConfig: GalleryModel = gallerySchema.parse(galleryJson);

import homeJson from "@/public/config/home.json";
import type {Model as HomeModel} from "@/configuration/home";
import {schema as homeSchema} from "@/configuration/home";
export const HomeConfig: HomeModel = homeSchema.parse(homeJson);

import journeyJson from "@/public/config/journey.json";
import type {Model as JourneyModel} from "@/configuration/journey";
import {schema as journeySchema} from "@/configuration/journey";
export const JourneyConfig: JourneyModel = journeySchema.parse(journeyJson);

import leftPanelJson from "@/public/config/left-panel.json";
import type {Model as LeftPanelModel} from "@/configuration/leftPanel";
import {schema as leftPanelSchema} from "@/configuration/leftPanel";
export const LeftPanelConfig: LeftPanelModel = leftPanelSchema.parse(leftPanelJson);

import projectsJson from "@/public/config/projects.json";
import type {Model as ProjectsModel} from "@/configuration/projects";
import {schema as projectsSchema} from "@/configuration/projects";
export const ProjectsConfig: ProjectsModel = projectsSchema.parse(projectsJson);

import quickLinksJson from "@/public/config/quick-links.json";
import type {Model as QuickLinksModel} from "@/configuration/quickLinks";
import {schema as quickLinksSchema} from "@/configuration/quickLinks";
export const QuickLinksConfig: QuickLinksModel = quickLinksSchema.parse(quickLinksJson);

import servicesJson from "@/public/config/services.json";
import type {Model as ServicesModel} from "@/configuration/services";
import {schema as servicesSchema} from "@/configuration/services";
export const ServicesConfig: ServicesModel = servicesSchema.parse(servicesJson);

import skillsJson from "@/public/config/skills.json";
import type {Model as SkillsModel} from "@/configuration/skills";
import {schema as skillsSchema} from "@/configuration/skills";
export const SkillsConfig: SkillsModel = skillsSchema.parse(skillsJson);

import testimonialsJson from "@/public/config/testimonials.json";
import type {Model as TestimonialsModel} from "@/configuration/testimonials";
import {schema as testimonialsSchema} from "@/configuration/testimonials";
export const TestimonialsConfig: TestimonialsModel = testimonialsSchema.parse(testimonialsJson);
