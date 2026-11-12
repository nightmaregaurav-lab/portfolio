import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/quickLinks";

export function initialQuickLinksMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "quickLinks.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "quickLinks.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
