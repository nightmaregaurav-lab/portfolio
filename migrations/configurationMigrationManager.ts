import {initialAboutMigration} from "@/migrations/about/initial";
import {migrateAboutToV1} from "@/migrations/about/v1";
import {initialBlogsMigration} from "@/migrations/blogs/initial";
import {migrateBlogsToV1} from "@/migrations/blogs/v1";
import {migrateBlogsToV2} from "@/migrations/blogs/v2";
import {initialCoreMigration} from "@/migrations/core/initial";
import {migrateCoreToV1} from "@/migrations/core/v1";
import {initialGalleryMigration} from "@/migrations/gallery/initial";
import {migrateGalleryToV1} from "@/migrations/gallery/v1";
import {initialHomeMigration} from "@/migrations/home/initial";
import {initialJourneyMigration} from "@/migrations/journey/initial";
import {initialProjectsMigration} from "@/migrations/projects/initial";
import {migrateProjectsToV1} from "@/migrations/projects/v1";
import {initialNavigationMigration} from "@/migrations/navigation/initial";
import {migrateNavigationToV1} from "@/migrations/navigation/v1";
import {initialQuickLinksMigration} from "@/migrations/quickLinks/initial";
import {initialServicesMigration} from "@/migrations/services/initial";
import {initialSkillsMigration} from "@/migrations/skills/initial";
import {initialTestimonialsMigration} from "@/migrations/testimonials/initial";
import {currentConfigurationVersions, serializeConfiguration} from "@/migrations/configurationVersions";

type ConfigurationMigration = (configuration: unknown) => unknown;
type InitialMigration = () => unknown;

type ConfigurationMigrationMap = Record<number, ConfigurationMigration>;

type VersionedConfiguration = {
  version: number;
  configuration: unknown;
};

const initialConfigurationVersion = 0;

const initialMigrationMap: Record<string, InitialMigration> = {
  about: initialAboutMigration,
  blogs: initialBlogsMigration,
  core: initialCoreMigration,
  gallery: initialGalleryMigration,
  home: initialHomeMigration,
  journey: initialJourneyMigration,
  navigation: initialNavigationMigration,
  projects: initialProjectsMigration,
  quickLinks: initialQuickLinksMigration,
  services: initialServicesMigration,
  skills: initialSkillsMigration,
  testimonials: initialTestimonialsMigration,
};

const configurationMigrationManager: Record<string, ConfigurationMigrationMap> = {
  about: {
    1: migrateAboutToV1
  },
  blog: {},
  blogs: {
    1: migrateBlogsToV1,
    2: migrateBlogsToV2,
  },
  core: {
    1: migrateCoreToV1,
  },
  gallery: {
    1: migrateGalleryToV1,
  },
  home: {},
  journey: {},
  navigation: {
    1: migrateNavigationToV1,
  },
  projects: {
    1: migrateProjectsToV1,
  },
  quickLinks: {},
  services: {},
  skills: {},
  testimonials: {},
};

function isVersionedConfiguration(value: unknown): value is VersionedConfiguration {
  return typeof value === "object"
    && value !== null
    && "version" in value
    && "configuration" in value;
}

function getConfigurationVersion(value: VersionedConfiguration | unknown): number {
  if (!isVersionedConfiguration(value)) {
    return initialConfigurationVersion;
  }

  if (!Number.isInteger(value.version) || value.version < 0) {
    throw new Error(`Configuration version must be a positive integer. Found: ${value.version}.`);
  }

  return value.version;
}

export function migrateConfiguration(
  identifier: string,
  value: unknown | null,
): VersionedConfiguration {
  const currentVersion = currentConfigurationVersions[identifier];
  if (currentVersion === undefined) {
    throw new Error(`Unknown configuration identifier "${identifier}".`);
  }

  if(value == null) {
    if(initialMigrationMap[identifier] == null){
      throw new Error(`No initial migration defined for configuration "${identifier}".`);
    }
    value = initialMigrationMap[identifier]();
  }

  const version = getConfigurationVersion(value);
  if (version > currentVersion) {
    throw new Error(
      `Configuration "${identifier}" is version ${version}, but this application only supports version ${currentVersion}.`,
    );
  }

  let configuration = isVersionedConfiguration(value)
    ? value.configuration
    : value;

  for (let nextVersion = version + 1; nextVersion <= currentVersion; nextVersion += 1) {
    const migration = configurationMigrationManager[identifier][nextVersion];
    if (!migration) {
      throw new Error(
        `Missing migration for configuration "${identifier}" from version ${nextVersion - 1} to ${nextVersion}.`,
      );
    }

    configuration = migration(configuration);
  }

  return {
    version: currentVersion,
    configuration,
  };
}

export {serializeConfiguration} from "@/migrations/configurationVersions";
