import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/journey";

export function initialJourneyMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "journey.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "journey.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
