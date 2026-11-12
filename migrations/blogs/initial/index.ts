import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/blogs";

export function initialBlogsMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "blogs.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "blogs.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
