import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";

const trackedConfigurationDirectory = join(process.cwd(), "public", "config");
const localConfigurationDirectory = join(process.cwd(), "local-config");

export function getConfigurationDirectory(): string {
  if (process.env.NODE_ENV === "development" && existsSync(localConfigurationDirectory)) {
    return localConfigurationDirectory;
  }

  return trackedConfigurationDirectory;
}

export function readConfigurationFile(filePath: string): unknown {
  const absolutePath = join(getConfigurationDirectory(), filePath);
  return JSON.parse(readFileSync(absolutePath, "utf8")) as unknown;
}
