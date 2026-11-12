import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/projects";

export function initialProjectsMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "projects.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "projects.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
