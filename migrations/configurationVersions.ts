export const currentConfigurationVersions: Record<string, number> = {
  about: 1,
  blog: 0,
  blogs: 2,
  core: 1,
  gallery: 1,
  home: 0,
  journey: 0,
  navigation: 1,
  projects: 1,
  quickLinks: 0,
  services: 0,
  skills: 0,
  testimonials: 0,
};

export function serializeConfiguration(identifier: string, configuration: unknown): string {
  const currentVersion = currentConfigurationVersions[identifier];
  if (currentVersion === undefined) {
    throw new Error(`Unknown configuration identifier "${identifier}".`);
  }

  return `${JSON.stringify({
    version: currentVersion,
    configuration,
  }, null, 2)}\n`;
}
