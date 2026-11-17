import {transliterate} from "transliteration";



export function slugify(value: string, exhaustedSet: Set<string>): string {
  if(!value) {
    return "";
  }

  const candidate = value
    .replace(/&/g, " and ")
    .toLowerCase()
    // Transliterate any non-Latin script (Devanagari, Greek, Chinese, Cyrillic, etc.) to Latin
    .split("")
    .map(ch => ch.charCodeAt(0) > 127 ? transliterate(ch) : ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!candidate) {
    return "";
  }

  if (exhaustedSet.has(candidate)) {
    let suffix = 1;
    let newCandidate = candidate + "-" + suffix;
    while (exhaustedSet.has(newCandidate)) {
      suffix++;
      newCandidate = candidate + "-" + suffix;
    }
    exhaustedSet.add(newCandidate);
    return newCandidate;
  } else {
    exhaustedSet.add(candidate);
    return candidate;
  }
}

export function getActiveSlug(slugs: {
  slug: string;
  isActive: boolean
}[]){
  const active = slugs.find(x => x.isActive);
  if(active){
    return active.slug;
  }
  return slugs[0].slug;
}
