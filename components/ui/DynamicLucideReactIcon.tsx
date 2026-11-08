"use client"

import * as Icons from "lucide-react";

export type LucideReactIconName = keyof typeof Icons;

function DynamicLucideReactIcon(
  {
    name,
    ...props
  }: {
    name: LucideReactIconName;
    [key: string]: any;
  }
) {
  const Icon = Icons[name] as any;
  if (!Icon) return null;
  return <Icon {...props} />;
}

export default DynamicLucideReactIcon;
