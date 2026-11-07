import {slugify} from "@/lib/slugs";
import {isNullOrWhitespace} from "@/lib/string";
import {createConfigurationId} from "@/lib/configurationUtils";

export function migrateBlogsToV1(configuration: unknown): unknown {
  if (typeof configuration !== "object" || configuration === null) {
    throw new Error("Invalid configuration format for migration.");
  }

  const value = configuration as {posts?: unknown};
  if (!Array.isArray(value.posts)) {
    return configuration;
  }

  for (const post of value.posts) {
    if (isNullOrWhitespace(post.id)) {
      post.id = createConfigurationId("blog");
    }

    const exhaustedSlugsExceptThisPost = new Set(value
      .posts
      .filter(x => x.id !== post.id)
      .flatMap(x => x.slugs)
      .map(x => x.slug)
    );
    const activeSlugCandidate = slugify(post.title, exhaustedSlugsExceptThisPost);
    let foundActiveSlug = false;
    for (const slugEntry of post.slugs) {
      if (slugEntry.slug === activeSlugCandidate) {
        slugEntry.isActive = true;
        foundActiveSlug = true;
        continue;
      }
      slugEntry.isActive = false;
    }
    if(!foundActiveSlug){
      post.slugs.push({
        slug: activeSlugCandidate,
        isActive: true
      });
    }
  }

  return value;
}
