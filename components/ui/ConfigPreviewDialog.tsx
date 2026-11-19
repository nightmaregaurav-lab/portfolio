"use client";

import { common, createLowlight } from "lowlight";
import { Check, Copy } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const lowlight = createLowlight(common);

type HighlightNode = {
  type: "root" | "element" | "text";
  tagName?: string;
  properties?: Record<string, unknown>;
  value?: string;
  children?: HighlightNode[];
};

function renderHighlightNode(
  node: HighlightNode,
  key: number | string,
): React.ReactNode {
  if (node.type === "text") {
    return node.value;
  }

  const children = node.children?.map((child, index) =>
    renderHighlightNode(child, index),
  );
  if (node.type === "root") {
    return children;
  }

  const properties = { ...node.properties };
  if (Array.isArray(properties.className)) {
    properties.className = properties.className.join(" ");
  }

  return React.createElement(
    node.tagName ?? "span",
    { ...properties, key },
    children,
  );
}

function ConfigPreviewDialog({
  show,
  setShow,
  configString,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  configString: string;
}) {
  const [copied, setCopied] = useState(false);
  const highlightedConfig = useMemo(
    () => lowlight.highlight("json", configString),
    [configString],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(configString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
          <DialogDescription>
            Current configuration in JSON format. Copy it to use elsewhere.
          </DialogDescription>
        </DialogHeader>
        <div className="relative rounded-lg border bg-muted/30 overflow-hidden">
          <pre
            className="hljs max-h-75 overflow-auto p-4 text-xs leading-relaxed"
            style={{ margin: 0 }}
          >
            <code>
              {renderHighlightNode(highlightedConfig as HighlightNode, "json")}
            </code>
          </pre>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer hover:-translate-y-px gap-1.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy config
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfigPreviewDialog;
