import {readdirSync, statSync} from "node:fs";
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

export default function Page() {
  const templates = getAvailableTemplates();
  return <PageContent templates={templates} />;
}
