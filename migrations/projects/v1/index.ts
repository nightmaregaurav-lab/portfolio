import {slugify} from "@/lib/slugs";
import {isNullOrWhitespace} from "@/lib/string";
import {createConfigurationId} from "@/lib/configurationUtils";

export function migrateProjectsToV1(configuration: unknown): unknown {
  if (typeof configuration !== "object" || configuration === null) {
    throw new Error("Invalid configuration format for migration.");
  }

  const value = configuration as {projects?: unknown};
  if (!Array.isArray(value.projects)) {
    return configuration;
  }

  for (const project of value.projects) {
    if (isNullOrWhitespace(project.id)) {
      project.id = createConfigurationId("project");
    }

    const exhaustedSlugsExceptThisProject = new Set(value
      .projects
      .filter(x => x.id != project.id)
      .flatMap(x => x.slugs)
      .map(x => x.slug)
    );
    const activeSlugCandidate = slugify(project.title, exhaustedSlugsExceptThisProject);
    let foundActiveSlug = false;
    for (const slugEntry of project.slugs) {
      if (slugEntry.slug === activeSlugCandidate) {
        slugEntry.isActive = true;
        foundActiveSlug = true;
        continue;
      }
      slugEntry.isActive = false;
    }
    if(!foundActiveSlug){
      project.slugs.push({
        slug: activeSlugCandidate,
        isActive: true
      });
    }
  }

  return value;
}
