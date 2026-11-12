export function migrateNavigationToV1(configuration: unknown): unknown {
  if (typeof configuration !== "object" || configuration === null) {
    throw new Error("Invalid configuration format for migration.");
  }

  const config = configuration as Record<string, unknown>;
  const navigations = (config.enabledMenus || config.enabledNavigations || []) as unknown[];
  const navigationConfig =  {
    ...config,
    enabledNavigations: navigations.filter((item: unknown) => typeof item === 'string' && item !== 'quickLinks'),
  };

  if ('enabledMenus' in navigationConfig) {
    delete navigationConfig.enabledMenus;
  }
  return navigationConfig;
}
