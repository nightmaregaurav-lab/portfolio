import {join} from "node:path";
import {existsSync, readFileSync, unlinkSync, writeFileSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/navigation";

export function initialNavigationMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const originalPath = join(configDirectory, "navigation.json");
  if (existsSync(originalPath)) {
    throw new Error(`Configuration file "navigation.json" already exists. Initial migration cannot be performed.`);
  }

  const legacyPath = join(configDirectory, "left-panel.json");
  if (existsSync(legacyPath)) {
    const legacyContent = readFileSync(legacyPath, "utf8");
    writeFileSync(originalPath, legacyContent);
    unlinkSync(legacyPath);
    return JSON.parse(readFileSync(originalPath, "utf8")) as unknown;
  }

  return defaultValues;
}
