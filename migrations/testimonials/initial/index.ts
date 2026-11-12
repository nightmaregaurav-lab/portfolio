import {join} from "node:path";
import {existsSync} from "node:fs";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {defaultValues} from "@/configuration/testimonials";

export function initialTestimonialsMigration(): unknown {
  const configDirectory = getConfigurationDirectory();

  const configPath = join(configDirectory, "testimonials.json");
  if (existsSync(configPath)) {
    throw new Error(`Configuration file "testimonials.json" already exists. Initial migration cannot be performed.`);
  }

  return defaultValues;
}
