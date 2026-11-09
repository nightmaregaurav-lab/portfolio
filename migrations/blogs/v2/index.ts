export function migrateBlogsToV2(configuration: unknown): unknown {
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
    if (!("accentColor" in post) || post.accentColor === undefined || post.accentColor === null) {
      post.accentColor = "#FFFFFF";
    }
  }

  return value;
}
