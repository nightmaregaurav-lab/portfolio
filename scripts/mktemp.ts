import {copyFileSync, existsSync, mkdirSync, readdirSync, statSync} from "node:fs";
import {join} from "node:path";

function copyDirectory(source: string, destination: string) {
  if (!existsSync(destination)) {
    mkdirSync(destination, {recursive: true});
  }

  for (const entry of readdirSync(source)) {
    const sourcePath = join(source, entry);
    const destPath = join(destination, entry);

    if (statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      copyFileSync(sourcePath, destPath);
    }
  }
}

const templateName = process.argv[2];

if (!templateName) {
  console.error("Usage: pnpm mktemp <template-name>");
  console.error("  templateName must be lowercase, dash or underscore separated (e.g. my-template, my_template).");
  process.exit(1);
}

const nameRegex = /^[a-z][a-z0-9]*([-_][a-z0-9]+)*$/;

if (!nameRegex.test(templateName)) {
  console.error(`Invalid template name: "${templateName}"`);
  console.error("  Name must be lowercase and use only dashes (-) or underscores (_) as separators.");
  process.exit(1);
}

const templatesDir = join(__dirname, "..", "templates");
const sourceDir = join(templatesDir, "blank");
const destDir = join(templatesDir, templateName);

if (existsSync(destDir)) {
  console.error(`Template "${templateName}" already exists.`);
  process.exit(1);
}

copyDirectory(sourceDir, destDir);
console.log(`Created template "${templateName}" from blank template.`);
