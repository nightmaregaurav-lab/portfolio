"use client";

import React from 'react';
import {cn} from "@/lib/utils";
import "@/components/block-editor/style.css";

type HtmlRendererProps =
  | ({as?: "div"; children: string} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "dangerouslySetInnerHTML">)
  | ({as: "span"; children: string} & Omit<React.ComponentPropsWithoutRef<"span">, "children" | "dangerouslySetInnerHTML">);

function HtmlRenderer(props: HtmlRendererProps) {
  if (props.as === "span") {
    const {as, children, className, ...spanProps} = props;
    return (
      <span
        {...spanProps}
        className={cn("html-renderer", className)}
        dangerouslySetInnerHTML={{__html: children}}
      />
    );
  }

  const {as, children, className, ...divProps} = props;
  return (
    <div
      {...divProps}
      className={cn("html-renderer", className)}
      dangerouslySetInnerHTML={{__html: children}}
    />
  );
}

export default HtmlRenderer;
