export function migrateAboutToV1(configuration: unknown): unknown {
  if (typeof configuration !== "object" || configuration === null) {
    throw new Error("Invalid configuration format for migration.");
  }

  // aboutMe is renamed to summary
  const {aboutMe, ...rest} = configuration as Record<string, unknown>;
  return {
    ...rest,
    summary: aboutMe,
  };
}
