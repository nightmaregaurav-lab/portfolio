import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/core";

export function initialCoreMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "core.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "core.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
