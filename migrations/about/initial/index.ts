import { existsSync } from "node:fs";
import { join } from "node:path";
import { defaultValues } from "@/configuration/about";
import { getConfigurationDirectory } from "@/configuration/configurationFiles";

export function initialAboutMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "about.json");
  if (existsSync(configPath)) {
    throw new Error(
      `Configuration file "about.json" already exists. Initial migration cannot be performed.`,
    );
  }

  return defaultValues;
}
