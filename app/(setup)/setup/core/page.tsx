import {existsSync, readdirSync, statSync} from "node:fs";
import {join} from "node:path";
import PageContent from "./page.content";

function getAvailableTemplates(): string[] {
  const templatesDirectory = join(process.cwd(), "templates");

  if (!statSync(templatesDirectory, {throwIfNoEntry: false})?.isDirectory()) {
    return [];
  }

  return readdirSync(templatesDirectory)
    .filter((entry) => statSync(join(templatesDirectory, entry)).isDirectory());
}

function getTemplatesWithAboutPages(): string[] {
  const templatesDirectory = join(process.cwd(), "templates");

  if (!statSync(templatesDirectory, {throwIfNoEntry: false})?.isDirectory()) {
    return [];
  }

  return readdirSync(templatesDirectory).filter((entry) => {
    const entryPath = join(templatesDirectory, entry);
    return statSync(entryPath).isDirectory() && existsSync(join(entryPath, "about.html"));
  });
}

export default function Page() {
  const templates = getAvailableTemplates();
  const templatesWithAboutPages = getTemplatesWithAboutPages();
  return <PageContent templates={templates} templatesWithAboutPages={templatesWithAboutPages} />;
}
