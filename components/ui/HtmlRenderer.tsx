import type React from "react";
import {cn} from "@/lib/utils";
import "@/components/block-editor/style.css";
import DOMPurify from "isomorphic-dompurify";

type HtmlRendererProps =
  | ({as?: "div"; children: string} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "dangerouslySetInnerHTML">)
  | ({as: "span"; children: string} & Omit<React.ComponentPropsWithoutRef<"span">, "children" | "dangerouslySetInnerHTML">);

function HtmlRenderer(props: HtmlRendererProps) {
  const sanitizedHtml = DOMPurify.sanitize(props.children);
  if (props.as === "span") {
    const {as, className, children: _, ...spanProps} = props;
    return (
      <span
        {...spanProps}
        className={cn("html-renderer", className)}
        dangerouslySetInnerHTML={{__html: sanitizedHtml}}
      />
    );
  }

  const {as, className, children: _, ...divProps} = props;
  return (
    <div
      {...divProps}
      className={cn("html-renderer", className)}
      dangerouslySetInnerHTML={{__html: sanitizedHtml}}
    />
  );
}

export default HtmlRenderer;
