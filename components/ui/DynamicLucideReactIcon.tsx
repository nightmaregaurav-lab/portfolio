import * as Icons from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type LucideReactIconName = keyof typeof Icons;

function DynamicLucideReactIcon({
  name,
  ...props
}: {
  name: LucideReactIconName;
  [key: string]: unknown;
}) {
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: nothing we can do about this, we need to dynamically access the icon component based on the name prop
  const Icon = Icons[name] as ComponentType<SVGProps<SVGSVGElement>>;
  if (!Icon) return null;
  return <Icon {...props} />;
}

export default DynamicLucideReactIcon;
