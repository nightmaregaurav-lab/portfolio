"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {TOutput as CoreConfigurationOutput, schema as CoreConfigurationSchema} from "@/configuration/core";
import {TOutput as LeftPanelConfigurationOutput, schema as LeftPanelConfigurationSchema} from "@/configuration/leftPanel";
import {TOutput as HomeConfigurationOutput, schema as HomeConfigurationSchema} from "@/configuration/home";
import {TOutput as AboutConfigurationOutput, schema as AboutConfigurationSchema} from "@/configuration/about";
import {TOutput as JourneyConfigurationOutput, schema as JourneyConfigurationSchema} from "@/configuration/journey";
import {TOutput as ProjectsConfigurationOutput, schema as ProjectsConfigurationSchema} from "@/configuration/projects";
import {TOutput as SkillsConfigurationOutput, schema as SkillsConfigurationSchema} from "@/configuration/skills";
import {TOutput as TestimonialsConfigurationOutput, schema as TestimonialsConfigurationSchema} from "@/configuration/testimonials";
import {TOutput as GalleryConfigurationOutput, schema as GalleryConfigurationSchema} from "@/configuration/gallery";
import {TOutput as QuickLinksConfigurationOutput, schema as QuickLinksConfigurationSchema} from "@/configuration/quickLinks";
import {TOutput as BlogsConfigurationOutput, schema as BlogsConfigurationSchema} from "@/configuration/blogs";
import {TOutput as BlogConfigurationOutput, schema as BlogConfigurationSchema} from "@/configuration/blog";
import {TOutput as ServicesConfigurationOutput, schema as ServicesConfigurationSchema} from "@/configuration/services";
import {toast} from "sonner";
import {useGitHubPatAuth} from "@/hooks/useGitHubPatAuth";
import {getGitHubFileContent, uploadGitHubFiles} from "@/lib/gitHub";
import {migrateConfiguration, serializeConfiguration} from "@/migrations/configurationMigrationManager";

export enum Identifier {
  Core = "core",
  LeftPanel = "leftPanel",
  Home = "home",
  About = "about",
  Journey = "journey",
  Projects = "projects",
  Skills = "skills",
  Testimonials = "testimonials",
  Gallery = "gallery",
  QuickLinks = "quickLinks",
  Blogs = "blogs",
  Blog = "blog",
  Services = "services",
}

type ConfigurationModelMap = {
  [Identifier.Core]: CoreConfigurationOutput;
  [Identifier.LeftPanel]: LeftPanelConfigurationOutput;
  [Identifier.Home]: HomeConfigurationOutput;
  [Identifier.About]: AboutConfigurationOutput;
  [Identifier.Journey]: JourneyConfigurationOutput;
  [Identifier.Projects]: ProjectsConfigurationOutput;
  [Identifier.Skills]: SkillsConfigurationOutput;
  [Identifier.Testimonials]: TestimonialsConfigurationOutput;
  [Identifier.Gallery]: GalleryConfigurationOutput;
  [Identifier.QuickLinks]: QuickLinksConfigurationOutput;
  [Identifier.Blogs]: BlogsConfigurationOutput;
  [Identifier.Blog]: BlogConfigurationOutput;
  [Identifier.Services]: ServicesConfigurationOutput;
};

type ConfigQuery = Record<string, string|number|null>;
type ConfigurationModel<K extends Identifier> = ConfigurationModelMap[K];
type ConfigHookResult<T extends Identifier> = {
  config: ConfigurationModel<T> | undefined;
  isLoadingConfig: boolean;
  saveConfig: (config: ConfigurationModel<T>) => Promise<void>;
  isSavingConfig: boolean;
};

const configurationPaths: Record<Identifier, (query?: ConfigQuery) => string> = {
  [Identifier.Core]: _ => `public/config/core.json`,
  [Identifier.LeftPanel]: _ => `public/config/left-panel.json`,
  [Identifier.Home]: _ => `public/config/home.json`,
  [Identifier.About]: _ => `public/config/about.json`,
  [Identifier.Journey]: _ => `public/config/journey.json`,
  [Identifier.Projects]: _ => `public/config/projects.json`,
  [Identifier.Skills]: _ => `public/config/skills.json`,
  [Identifier.Testimonials]: _ => `public/config/testimonials.json`,
  [Identifier.Gallery]: _ => `public/config/gallery.json`,
  [Identifier.QuickLinks]: _ => `public/config/quick-links.json`,
  [Identifier.Blogs]: _ => `public/config/blogs.json`,
  [Identifier.Blog]: (query) => `public/config/blogs/${query ? query["id"] : "empty"}.json`,
  [Identifier.Services]: _ => `public/config/services.json`,
};

const configurationSchemas = {
  [Identifier.Core]: CoreConfigurationSchema,
  [Identifier.LeftPanel]: LeftPanelConfigurationSchema,
  [Identifier.Home]: HomeConfigurationSchema,
  [Identifier.About]: AboutConfigurationSchema,
  [Identifier.Journey]: JourneyConfigurationSchema,
  [Identifier.Projects]: ProjectsConfigurationSchema,
  [Identifier.Skills]: SkillsConfigurationSchema,
  [Identifier.Testimonials]: TestimonialsConfigurationSchema,
  [Identifier.Gallery]: GalleryConfigurationSchema,
  [Identifier.QuickLinks]: QuickLinksConfigurationSchema,
  [Identifier.Blogs]: BlogsConfigurationSchema,
  [Identifier.Blog]: BlogConfigurationSchema,
  [Identifier.Services]: ServicesConfigurationSchema,
};

export function useConfig<T extends Identifier>(configIdentifier: T, query?: ConfigQuery): ConfigHookResult<T>{
  const queryClient = useQueryClient();

  const {
    data,
    isLoading
  } = useQuery({
    queryKey: [configIdentifier, query],
    queryFn: async () => await getConfig(
      configIdentifier,
      query,
      gitHubPat,
      gitHubSession?.repository?.full_name || ""
    ),
    refetchOnWindowFocus: false
  });

  const {
    gitHubPat,
    gitHubSession
  } = useGitHubPatAuth();

  const {
    mutateAsync,
    isPending
  } = useMutation({
    mutationKey: [configIdentifier, query],
    mutationFn: async (newConfig: ConfigurationModel<T>) => await saveConfig(
      configIdentifier,
      query,
      newConfig,
      gitHubPat,
      gitHubSession?.repository?.full_name || ""
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [configIdentifier, query] });
      toast.success(`Config saved successfully: ${configIdentifier}`);
    },
    onError: async (error) => {
      const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : `Failed to save ${configIdentifier} config.`;
      toast.error(errorMessage);
    }
  });

  return {
    config: data,
    isLoadingConfig: isLoading,
    saveConfig: mutateAsync,
    isSavingConfig: isPending
  };
}

async function saveConfig<T extends Identifier>(
  configIdentifier: T,
  query: ConfigQuery | undefined,
  newConfig: ConfigurationModel<T>,
  gitHubPat: string | null,
  repo: string
): Promise<void> {
  const configPathFunction = configurationPaths[configIdentifier];
  const filePath = configPathFunction(query);
  const content = serializeConfiguration(configIdentifier, newConfig);
  await uploadGitHubFiles(
    gitHubPat ?? "",
    repo,
    filePath.substring(0, filePath.lastIndexOf("/")),
    [
      {
        name: filePath.substring(filePath.lastIndexOf("/") + 1),
        content,
      },
    ]
  )
}

async function getConfig<T extends Identifier>(
  configIdentifier: T,
  query: ConfigQuery | undefined,
  gitHubPat: string | null,
  repo: string
): Promise<ConfigurationModel<T>> {
  const configPathFunction = configurationPaths[configIdentifier];
  const filePath = configPathFunction(query);
  const response = await getGitHubFileContent(
    gitHubPat ?? "",
    repo,
    filePath
  );

  const migratedConfig = migrateConfiguration(configIdentifier, JSON.parse(response));
  return configurationSchemas[configIdentifier].parse(migratedConfig.configuration) as ConfigurationModel<T>;
}
