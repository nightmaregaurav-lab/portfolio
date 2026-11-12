import path from "path";
import fs from "fs";

export const dynamic = "force-static";

export function generateStaticParams() {
  const templatesDir = path.join(process.cwd(), "templates");
  if (!fs.existsSync(templatesDir)) {
    return [];
  }

  return fs
    .readdirSync(templatesDir)
    .filter((name) => {
      const aboutPath = path.join(templatesDir, name, "about.html");
      return fs.existsSync(aboutPath);
    })
    .map((name) => ({ name }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const templatePath = path.join(process.cwd(), "templates", name, "about.html");

  const html = fs.readFileSync(templatePath, "utf-8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
