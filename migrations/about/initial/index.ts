import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/about";

export function initialAboutMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "about.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "about.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
