"use client"

import React, {useMemo} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {common, createLowlight} from "lowlight";

const lowlight = createLowlight(common);

type HighlightNode = {
  type: "root" | "element" | "text";
  tagName?: string;
  properties?: Record<string, unknown>;
  value?: string;
  children?: HighlightNode[];
};

function renderHighlightNode(node: HighlightNode, key: number | string): React.ReactNode {
  if (node.type === "text") {
    return node.value;
  }

  const children = node.children?.map((child, index) => renderHighlightNode(child, index));
  if (node.type === "root") {
    return children;
  }

  const properties = {...node.properties};
  if (Array.isArray(properties.className)) {
    properties.className = properties.className.join(" ");
  }

  return React.createElement(node.tagName ?? "span", {...properties, key}, children);
}

function ConfigPreviewDialog(
  {show, setShow, configString}: {
    show: boolean,
    setShow: (show: boolean) => void,
    configString: string
  }
) {
  const highlightedConfig = useMemo(
    () => lowlight.highlight("json", configString),
    [configString]
  );
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent
        style={{
          width: 'auto', maxWidth: '100%',
          height: 'auto', maxHeight: '100%'
        }}
      >
        <DialogHeader>
          <DialogTitle><b>JSON Preview</b></DialogTitle>
        </DialogHeader>
        <pre
          className="hljs"
          style={{
            width: "100%",
            height: "100%",
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          <code>{renderHighlightNode(highlightedConfig as HighlightNode, "json")}</code>
        </pre>
      </DialogContent>
    </Dialog>
  );
}

export default ConfigPreviewDialog;
