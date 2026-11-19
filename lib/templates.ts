import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CoreConfig } from "@/configuration";

export enum Templates {
  Empty = "empty",
  Server = "server",
  Client = "client",
}

export function getTemplateType(route: string): Templates {
  const templatePath = join(
    process.cwd(),
    "templates",
    CoreConfig.template,
    route,
    "page.content.tsx",
  );
  return getFileType(templatePath);
}

export function getFileType(filePath: string): Templates {
  if (!existsSync(filePath)) {
    return Templates.Empty;
  }
  const content = readFileSync(filePath, "utf-8");
  const firstLine = content.split(/\n/)[0].trim();
  return firstLine === '"use client"' || firstLine === "'use client'"
    ? Templates.Client
    : Templates.Server;
}
