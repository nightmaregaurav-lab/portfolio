export function migrateCoreToV1(configuration: unknown): unknown {
  if (typeof configuration !== "object" || configuration === null) {
    throw new Error("Invalid configuration format for migration.");
  }

  // Add default template value if not present
  const config = configuration as Record<string, unknown>;
  return {
    ...config,
    template: config.template || "default",
  };
}
