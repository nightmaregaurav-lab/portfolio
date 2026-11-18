import {NextResponse} from "next/server";
import {
  BlogsConfig,
  CoreConfig,
  GalleryConfig,
  NavigationConfig,
  ProjectsConfig,
} from "@/configuration";
import {getCanonicalUrl} from "@/lib/pageMetadata";

export const dynamic = "force-static";

const MENU_PATH_MAP = [
  {menu: "home", path: "/"},
  {menu: "about", path: "/about/"},
  {menu: "projects", path: "/projects/"},
  {menu: "services", path: "/services/"},
  {menu: "skills", path: "/skills/"},
  {menu: "journey", path: "/journey/"},
  {menu: "testimonials", path: "/testimonials/"},
  {menu: "gallery", path: "/gallery/"},
  {menu: "blogs", path: "/blogs/"},
];

function getSitemapSlug(slugs: {slug: string; isActive: boolean}[]) {
  return slugs.find((s) => s.isActive)?.slug || slugs[0]?.slug;
}

export function GET() {
  const lines: string[] = [];

  // Site header
  const siteName = CoreConfig.websiteName || CoreConfig.fullName || "Portfolio";
  lines.push(`# ${siteName}`);

  if (CoreConfig.seoDescription) {
    lines.push("");
    lines.push(CoreConfig.seoDescription);
  }

  // Important pages
  lines.push("");
  lines.push("## Important Pages");
  lines.push("");

  for (const item of MENU_PATH_MAP) {
    if (NavigationConfig.enabledNavigations.includes(item.menu)) {
      const url = getCanonicalUrl(item.path);
      if (url) {
        const label = item.menu.charAt(0).toUpperCase() + item.menu.slice(1);
        lines.push(`- **${label}:** ${url}`);
      }
    }
  }

  // Projects
  if (NavigationConfig.enabledNavigations.includes("projects") && ProjectsConfig.projects.length > 0) {
    lines.push("");
    lines.push("## Projects");
    lines.push("");
    for (const project of ProjectsConfig.projects) {
      const slug = getSitemapSlug(project.slugs);
      if (slug) {
        const url = getCanonicalUrl("/projects/" + slug + "/");
        if (url) {
          lines.push(`- **${project.title}** ${url}`);
        }
      }
    }
  }

  // Blog posts
  if (NavigationConfig.enabledNavigations.includes("blogs") && BlogsConfig.posts.length > 0) {
    lines.push("");
    lines.push("## Blog Posts");
    lines.push("");
    const sortedPosts = [...BlogsConfig.posts].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    for (const post of sortedPosts) {
      const slug = getSitemapSlug(post.slugs);
      if (slug) {
        const url = getCanonicalUrl("/blogs/" + slug + "/");
        if (url) {
          lines.push(`- **${post.title}** (${post.date})`);
          lines.push(`  ${url}`);
        }
      }
    }
  }

  // Gallery collections
  if (NavigationConfig.enabledNavigations.includes("gallery") && GalleryConfig.categories.length > 0) {
    lines.push("");
    lines.push("## Gallery");
    lines.push("");
    for (const collection of GalleryConfig.categories) {
      const slug = getSitemapSlug(collection.slugs);
      if (slug) {
        const url = getCanonicalUrl("/gallery/" + slug + "/");
        if (url) {
          lines.push(`- **${collection.name}** ${url}`);
        }
      }
    }
  }

  // Technical details
  lines.push("");
  lines.push("## Technical Details");
  lines.push("");
  const sitemapUrl = getCanonicalUrl("/sitemap.xml");
  const robotsUrl = getCanonicalUrl("/robots.txt");
  if (sitemapUrl) lines.push(`- Sitemap: ${sitemapUrl}`);
  if (robotsUrl) lines.push(`- Robots: ${robotsUrl}`);

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
