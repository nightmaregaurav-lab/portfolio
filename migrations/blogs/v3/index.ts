export function migrateBlogsToV3(configuration: unknown): unknown {
  if (typeof configuration !== "object" || configuration === null) {
    throw new Error("Invalid configuration format for migration.");
  }

  const value = configuration as {posts?: unknown};
  if (!Array.isArray(value.posts)) {
    return configuration;
  }

  for (const post of value.posts) {
    if (typeof post !== "object" || post === null) {
      continue;
    }
    if (!("coverImage" in post) || post.coverImage === undefined || post.coverImage === null) {
      post.coverImage = "";
    }
  }

  return value;
}
