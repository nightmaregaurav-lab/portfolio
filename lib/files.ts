export type FileType =
  | "Image"
  | "Video"
  | "Audio"
  | "Text"
  | "HTML"
  | "CSS"
  | "CSV"
  | "JSON"
  | "XML"
  | "JavaScript"
  | "Markdown"
  | "PDF"
  | "Word"
  | "Excel"
  | "PowerPoint"
  | "RTF"
  | "Archive"
  | "Font"
  | "Other";

const EXTENSION_TO_TYPE_MAP: Record<string, FileType> = {
  // Text
  txt: "Text",
  html: "HTML",
  htm: "HTML",
  css: "CSS",
  csv: "CSV",
  xml: "XML",
  md: "Markdown",
  js: "JavaScript",

  // Structured data
  json: "JSON",

  // Documents
  pdf: "PDF",
  rtf: "RTF",
  doc: "Word",
  docx: "Word",

  xls: "Excel",
  xlsx: "Excel",

  ppt: "PowerPoint",
  pptx: "PowerPoint",

  // Archives
  zip: "Archive",
  rar: "Archive",
  gz: "Archive",
  tar: "Archive",
  "7z": "Archive",

  // Fonts
  woff: "Font",
  woff2: "Font",
  ttf: "Font",
  otf: "Font",

  // Images
  jpg: "Image",
  jpeg: "Image",
  png: "Image",
  gif: "Image",
  bmp: "Image",
  webp: "Image",
  svg: "Image",
  ico: "Image",
  heic: "Image",

  // Videos
  mp4: "Video",
  mov: "Video",
  avi: "Video",
  mkv: "Video",
  webm: "Video",
  hevc: "Video",

  // Audio
  mp3: "Audio",
  wav: "Audio",
  ogg: "Audio",
};

export function getFileTypeFromExtension(filename?: string | null): FileType {
  if (!filename) return "Other";
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) return "Other";
  return EXTENSION_TO_TYPE_MAP[extension] ?? "Other";
}

export function humanizeFileSize(bytes: number): string {
  bytes ??= 0;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / 1024 ** i)} ${sizes[i]}`;
}
