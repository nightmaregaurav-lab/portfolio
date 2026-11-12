import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/home";

export function initialHomeMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "home.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "home.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
