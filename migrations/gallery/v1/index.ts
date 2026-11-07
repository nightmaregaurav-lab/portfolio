import {slugify} from "@/lib/slugs";

export function migrateGalleryToV1(configuration: unknown): unknown {
  if (typeof configuration !== "object" || configuration === null) {
    throw new Error("Invalid configuration format for migration.");
  }

  const value = configuration as {categories?: unknown};
  if (!Array.isArray(value.categories)) {
    return configuration;
  }

  for (const category of value.categories){
    const exhaustedSlugsExceptThisCategory = new Set(value
      .categories
      .filter(x => x.name != category.name)
      .flatMap(x => x.slugs)
      .map(x => x.slug)
    );
    const activeSlugCandidate = slugify(category.name, exhaustedSlugsExceptThisCategory);
    let foundActiveSlug = false;
    for (const slugEntry of category.slugs){
      if (slugEntry.slug === activeSlugCandidate) {
        slugEntry.isActive = true;
        foundActiveSlug = true;
        continue;
      }
      slugEntry.isActive = false;
    }
    if(!foundActiveSlug){
      category.slugs.push({
        slug: activeSlugCandidate,
        isActive: true
      });
    }
  }

  return value;
}
