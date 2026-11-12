import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/gallery";

export function initialGalleryMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "gallery.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "gallery.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
