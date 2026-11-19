"use client";

import type { Editor } from "@tiptap/react";

import { DEFAULT_ICONS } from "../icons";
import { BubbleButton, BubbleButtonGroup } from "../ui";
import { shallowEqual, useEditorState } from "./utils";

interface TextSelectorResult {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  isCode: boolean;
}

interface ToggleableChain {
  run(): boolean;
  toggleBold(): ToggleableChain;
  toggleCode(): ToggleableChain;
  toggleItalic(): ToggleableChain;
  toggleStrike(): ToggleableChain;
  toggleUnderline(): ToggleableChain;
}

const textItems = [
  {
    name: "bold",
    command: (e: Editor) =>
      (e.chain().focus() as unknown as ToggleableChain).toggleBold().run(),
    icon: DEFAULT_ICONS.boldIcon,
    isActive: (s: TextSelectorResult) => s.isBold,
  },
  {
    name: "italic",
    command: (e: Editor) =>
      (e.chain().focus() as unknown as ToggleableChain).toggleItalic().run(),
    icon: DEFAULT_ICONS.italicIcon,
    isActive: (s: TextSelectorResult) => s.isItalic,
  },
  {
    name: "underline",
    command: (e: Editor) =>
      (e.chain().focus() as unknown as ToggleableChain).toggleUnderline().run(),
    icon: DEFAULT_ICONS.underlineIcon,
    isActive: (s: TextSelectorResult) => s.isUnderline,
  },
  {
    name: "strike",
    command: (e: Editor) =>
      (e.chain().focus() as unknown as ToggleableChain).toggleStrike().run(),
    icon: DEFAULT_ICONS.strikethroughIcon,
    isActive: (s: TextSelectorResult) => s.isStrike,
  },
  {
    name: "code",
    command: (e: Editor) =>
      (e.chain().focus() as unknown as ToggleableChain).toggleCode().run(),
    icon: DEFAULT_ICONS.codeIcon,
    isActive: (s: TextSelectorResult) => s.isCode,
  },
];

export const TextButtons = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState(
    editor,
    (ed) => ({
      isBold: ed.isActive("bold"),
      isCode: ed.isActive("code"),
      isItalic: ed.isActive("italic"),
      isStrike: ed.isActive("strike"),
      isUnderline: ed.isActive("underline"),
    }),
    shallowEqual,
  );

  return (
    <BubbleButtonGroup>
      {textItems.map((item) => (
        <BubbleButton
          key={item.name}
          active={item.isActive(editorState)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => item.command(editor)}
        >
          {item.icon}
        </BubbleButton>
      ))}
    </BubbleButtonGroup>
  );
};
