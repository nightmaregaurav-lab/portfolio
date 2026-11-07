import {readdirSync, readFileSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";
import {migrateConfiguration, serializeMigratedConfiguration} from "@/migrations/configurationMigrationManager";

type ConfigurationFile = {
  identifier: string;
  path: string;
};

const configurationDirectory = getConfigurationDirectory();

const configurationFiles: ConfigurationFile[] = [
  {identifier: "about", path: "about.json"},
  {identifier: "blogs", path: "blogs.json"},
  {identifier: "core", path: "core.json"},
  {identifier: "gallery", path: "gallery.json"},
  {identifier: "home", path: "home.json"},
  {identifier: "journey", path: "journey.json"},
  {identifier: "leftPanel", path: "left-panel.json"},
  {identifier: "projects", path: "projects.json"},
  {identifier: "quickLinks", path: "quick-links.json"},
  {identifier: "services", path: "services.json"},
  {identifier: "skills", path: "skills.json"},
  {identifier: "testimonials", path: "testimonials.json"},
];

function getConfigurationFiles(): ConfigurationFile[] {
  const blogDirectory = join(configurationDirectory, "blogs");
  const blogFiles = readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => ({
      identifier: "blog",
      path: join("blogs", fileName),
    }));

  return [...configurationFiles, ...blogFiles];
}

for (const file of getConfigurationFiles()) {
  const filePath = join(configurationDirectory, file.path);
  const source = readFileSync(filePath, "utf8");
  const configuration = JSON.parse(source) as unknown;
  const migratedConfiguration = migrateConfiguration(file.identifier, configuration);
  const output = serializeMigratedConfiguration(migratedConfiguration);

  if (source !== output) {
    writeFileSync(filePath, output);
    console.log(`Migrated ${file.path} to version ${migratedConfiguration.version}.`);
  }
}
