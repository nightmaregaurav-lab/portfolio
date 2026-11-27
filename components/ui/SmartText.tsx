import { ExternalLink } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import SmartLink from "@/components/ui/SmartLink";
import { stripHtmlTags } from "@/lib/html";
import { cn } from "@/lib/utils";

type SmartTextProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children" | "dangerouslySetInnerHTML"
> & {
  children: string;
};

const detectedLinkPattern =
  /https?:\/\/\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(\+?\d{1,4}[\s-])?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/gi;

function linkifyText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(detectedLinkPattern)) {
    const value = match[0];
    const start = match.index ?? 0;
    const isUrl = /^https?:\/\//i.test(value);
    const isEmail = value.includes("@");
    const href = isUrl
      ? value
      : isEmail
        ? `mailto:${value}`
        : `tel:${value.replace(/[\s-]/g, "")}`;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <SmartLink
        key={`${start}-${href}`}
        href={href}
        target={isUrl ? "_blank" : "_self"}
        className="external-link"
      >
        {value}
        {isUrl && <ExternalLink size={14} aria-hidden="true" />}
      </SmartLink>,
    );
    lastIndex = start + value.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

const SmartText = (props: SmartTextProps) => {
  const { children, className, ...spanProps } = props;

  return (
    <span {...spanProps} className={cn("html-renderer", className)}>
      {linkifyText(stripHtmlTags(children))}
    </span>
  );
};

export default SmartText;
