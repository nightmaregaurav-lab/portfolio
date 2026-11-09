import {migrateAboutToV1} from "@/migrations/about/v1";
import {migrateBlogsToV1} from "@/migrations/blogs/v1";
import {migrateBlogsToV2} from "@/migrations/blogs/v2";
import {migrateGalleryToV1} from "@/migrations/gallery/v1";
import {migrateProjectsToV1} from "@/migrations/projects/v1";

export type ConfigurationMigration = (configuration: unknown) => unknown;

type ConfigurationMigrationMap = Record<number, ConfigurationMigration>;

type VersionedConfiguration = {
  version: number;
  configuration: unknown;
};

const initialConfigurationVersion = 0;

const currentConfigurationVersions: Record<string, number> = {
  about: 1,
  blog: initialConfigurationVersion,
  blogs: 2,
  core: initialConfigurationVersion,
  gallery: 1,
  home: initialConfigurationVersion,
  journey: initialConfigurationVersion,
  leftPanel: initialConfigurationVersion,
  projects: 1,
  quickLinks: initialConfigurationVersion,
  services: initialConfigurationVersion,
  skills: initialConfigurationVersion,
  testimonials: initialConfigurationVersion,
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
  core: {},
  gallery: {
    1: migrateGalleryToV1,
  },
  home: {},
  journey: {},
  leftPanel: {},
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
  value: unknown,
): VersionedConfiguration {
  const currentVersion = currentConfigurationVersions[identifier];
  if (currentVersion === undefined) {
    throw new Error(`Unknown configuration identifier "${identifier}".`);
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

export function serializeConfiguration(identifier: string, configuration: unknown): string {
  const currentVersion = currentConfigurationVersions[identifier];
  if (currentVersion === undefined) {
    throw new Error(`Unknown configuration identifier "${identifier}".`);
  }

  return `${JSON.stringify({
    version: currentVersion,
    configuration,
  }, null, 2)}\n`;
}

export function serializeMigratedConfiguration(configuration: VersionedConfiguration): string {
  return `${JSON.stringify(configuration, null, 2)}\n`;
}
