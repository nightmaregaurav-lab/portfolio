import Link from "next/link";
import type { ComponentProps } from "react";

type SmartLinkProps = ComponentProps<typeof Link> & {
  external?: boolean;
};

export default function SmartLink(
  {
    href,
    external,
    ...props
  }: SmartLinkProps
) {
  const isExternal = external ?? (typeof href === "string" && /^(https?:\/\/|mailto:|tel:)/i.test(href));

  if (isExternal) {
    return (
      <a
        href={href as string}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  }

  return <Link href={href} {...props} />;
}
