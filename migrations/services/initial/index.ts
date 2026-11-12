import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/services";

export function initialServicesMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "services.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "services.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
