import {isNullOrWhitespace} from "@/lib/string";

export function createConfigurationId(prefix?: string) {
  const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
    : Math.random().toString(36).slice(2, 14);
  if (prefix) {
    return `${prefix}-${randomId}`;
  }
  return randomId;
}

export function withConfigurationId<T extends object>(entry: T & {id?: string}, prefix?: string): Omit<T, "id"> & {id: string} {
  return {
    ...entry,
    id: isNullOrWhitespace(entry.id)
      ? createConfigurationId(prefix)
      : (entry.id as string)
  };
}

export function generateMilestoneLabel(milestone: {
  title?: string;
  start?: string;
  end?: string;
  department?: string;
  organisation?: string;
}) {
  const { title, start, end, department, organisation } = milestone;

  const bigDot = "•";

  const departmentPart = department ? `${department} ` : "";
  const organisationPart = department ? `@ ${organisation}` : organisation || "";
  const details = [departmentPart, organisationPart]
    .filter(Boolean)
    .map((part) => part.trim())
    .join(" ")
    .trim();
  const datePart = start ? `(${start}${end ? ` — ${end}` : ""})` : "";

  return `${title} ${details.length ? (bigDot + " " + details) : details} ${datePart}`.trim();
}
