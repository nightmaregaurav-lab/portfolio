export function stripHtmlTags(str?: string | null): string {
  if (!str) {
    return "";
  }

  return str
    .replaceAll(/<[^>]*>/g, " ")
    .replaceAll(/&nbsp;/gi, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}
