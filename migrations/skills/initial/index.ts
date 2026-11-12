import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/skills";

export function initialSkillsMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "skills.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "skills.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
