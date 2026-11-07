"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor, Range } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  BlockEditor,
  SlashCommand,
  defaultSlashCommandItems,
  getSlashCommandSuggestion,
} from "@/components/block-editor";
import type { SlashCommandSuggestionItem } from "@/components/block-editor";
import "@/components/block-editor/style.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      imageAlign: {
        default: "left",
        parseHTML: (element) => element.getAttribute("data-image-align") || "left",
        renderHTML: (attributes) => ({
          "data-image-align": attributes.imageAlign,
        }),
      },
      imageWrap: {
        default: "none",
        parseHTML: (element) => element.getAttribute("data-image-wrap") || "none",
        renderHTML: (attributes) => ({
          "data-image-wrap": attributes.imageWrap,
        }),
      },
      imageCrop: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-image-crop") === "true",
        renderHTML: (attributes) =>
          attributes.imageCrop ? { "data-image-crop": "true" } : {},
      },
    };
  },
});

function ImageToolbar({ editor }: { editor: Editor }) {
  const [, refresh] = useState(0);

  useEffect(() => {
    const update = () => refresh((value) => value + 1);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const imageActive = editor.isActive("image");
  if (!imageActive) return null;

  const imageAttributes = editor.getAttributes("image") as {
    imageAlign?: "left" | "center" | "right";
    imageWrap?: "none" | "left" | "right";
    imageCrop?: boolean;
  };

  const updateImage = (attributes: Record<string, string | boolean>) => {
    editor.chain().focus().updateAttributes("image", attributes).run();
  };

  return (
    <div className="rich-text-image-toolbar" aria-label="Image options">
      <span className="rich-text-image-toolbar-label">Image</span>
      {(["left", "center", "right"] as const).map((align) => (
        <Button
          key={align}
          variant="ghost"
          size="sm"
          type="button"
          className={cn(
            "rich-text-image-toolbar-button",
            imageAttributes.imageAlign === align && "is-active"
          )}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => updateImage({ imageAlign: align })}
          aria-pressed={imageAttributes.imageAlign === align}
        >
          {align[0].toUpperCase() + align.slice(1)}
        </Button>
      ))}
      <span className="rich-text-image-toolbar-divider" />
      {(["none", "left", "right"] as const).map((wrap) => (
        <Button
          key={wrap}
          variant="ghost"
          size="sm"
          type="button"
          className={cn(
            "rich-text-image-toolbar-button",
            imageAttributes.imageWrap === wrap && "is-active"
          )}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => updateImage({ imageWrap: wrap })}
          aria-pressed={imageAttributes.imageWrap === wrap}
        >
          {wrap === "none" ? "No wrap" : `Wrap ${wrap}`}
        </Button>
      ))}
      <span className="rich-text-image-toolbar-divider" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "rich-text-image-toolbar-button",
          imageAttributes.imageCrop && "is-active"
        )}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => updateImage({ imageCrop: !imageAttributes.imageCrop })}
        aria-pressed={imageAttributes.imageCrop}
        title="Crop uses the image's saved dimensions; resize first for a custom crop frame."
      >
        {imageAttributes.imageCrop ? "Show full" : "Crop"}
      </Button>
    </div>
  );
}

function createSlashCommandItems(
  onImageRequest: (range: Range) => void
): SlashCommandSuggestionItem[] {
  return [
    ...defaultSlashCommandItems,
    {
      id: "image",
      title: "Image",
      description: "Insert an image.",
      keywords: ["image", "img", "picture", "photo"],
      command: ({ range }) => {
        onImageRequest(range);
      },
    },
    {
      id: "table",
      title: "Table",
      description: "Insert a table.",
      keywords: ["table", "grid"],
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
  ];
}

export interface RichTextEditorProps {
  id?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  id,
  className,
  value,
  onChange,
  placeholder = "Type / for commands...",
}: RichTextEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageRange, setImageRange] = useState<Range | null>(null);

  const requestImage = useCallback((range: Range) => {
    setImageRange(range);
    setImageUrl("");
    setImageAlt("");
    setImageTitle("");
    setImageDialogOpen(true);
  }, []);

  const slashCommandItems = createSlashCommandItems(requestImage);
  const editor = useEditor({
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor: updatedEditor }) => {
      onChange(updatedEditor.getHTML());
    },
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({
        autolink: true,
        openOnClick: false,
      }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        alignments: ["left", "center", "right"],
      }),
      Table,
      TableRow,
      TableCell,
      TableHeader,
      BlogImage.configure({
        resize: {
          enabled: true,
          directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
          minWidth: 96,
          minHeight: 64,
          alwaysPreserveAspectRatio: true,
        },
      }),
      SlashCommand.configure({
        suggestion: getSlashCommandSuggestion(slashCommandItems),
      }),
    ],
  });

  useEffect(() => {
    if (!editor) return;
    if (value === "" ? editor.isEmpty : editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const closeImageDialog = () => {
    setImageDialogOpen(false);
    setImageRange(null);
    setImageUrl("");
    setImageAlt("");
    setImageTitle("");
  };

  const insertImage = () => {
    const url = imageUrl.trim();
    if (!url || !imageRange || !editor) return;

    editor
      .chain()
      .focus()
      .deleteRange(imageRange)
      .setImage({
        src: url,
        alt: imageAlt.trim() || undefined,
        title: imageTitle.trim() || undefined,
      })
      .run();
    closeImageDialog();
  };

  return (
    <div id={id} className={cn("border rounded-md", className)}>
      <BlockEditor editor={editor} />
      {editor && <ImageToolbar editor={editor} />}
      <Dialog
        open={imageDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setImageDialogOpen(true);
          } else {
            closeImageDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert image</DialogTitle>
            <DialogDescription>
              Paste the URL of the image you want to add.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            aria-label="Image URL"
          />
          <Input
            className="mt-3"
            type="text"
            placeholder="Alternative text (recommended)"
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            aria-label="Image alternative text"
          />
          <Input
            className="mt-3"
            type="text"
            placeholder="Caption or image title (optional)"
            value={imageTitle}
            onChange={(event) => setImageTitle(event.target.value)}
            aria-label="Image title"
          />
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={closeImageDialog} className="cursor-pointer hover:-translate-y-px">
              Cancel
            </Button>
            <Button type="button" disabled={!imageUrl.trim()} className="cursor-pointer hover:-translate-y-px" onClick={insertImage}>
              Insert image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
