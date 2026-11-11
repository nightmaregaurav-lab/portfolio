import {z} from "zod";

export const schema = z.object({
  favicon: z
    .url("Favicon must be a valid URL")
    .min(1, "Favicon is required.")
    .meta({
      title: "Favicon",
      description:
        "An icon that will be used as a favicon for the website. " +
        "It is recommended to use a square image of size 512x512px. " +
        "This is different from the profile picture, which is used in the left panel, " +
        "the cover picture, which is used as a background for the landing page, " +
        "and the hero picture, which is used in the about page.",
    }
  ),
  websiteName: z
    .string()
    .min(1, "Website name is required.")
    .meta({
      title: "Website Name",
      description: "The name of the website.",
    }
  ),
  fullName: z
    .string("Full Name is required")
    .min(1, "Full name is required.")
    .meta({
      title: "Full Name",
      description:
        "The full name of the website owner. This will be used anywhere " +
        "the full name is required, such as in the left panel, the about page, " +
        "and the SEO metadata.",
    }
  ),
  seoDescription: z
    .string()
    .optional()
    .meta({
      title: "SEO Description",
      description:
        "A short description of the website that will be used in the SEO metadata. " +
        "This is different from the about page, which is a longer description of who you are.",
    }
  ),
  seoKeywords: z
    .array(z.string("Please enter a valid keyword").min(1, "Keyword is required.").meta({
      title: "SEO Keyword",
      description: "A search term associated with the website.",
    }))
    .default([])
    .meta({
      title: "SEO Keywords",
      description:
        "Short search terms that describe the whole website. Enter plain words separated by commas; " +
        "avoid repeating the website name or writing complete sentences.",
    }),
  template: z
    .string()
    .min(1, "Template is required.")
    .default("default")
    .meta({
      title: "Template",
      description:
        "The visual template used for rendering content pages. " +
        "Options are determined by the folders inside the templates directory.",
    }),
}).meta({
  title: "Core Configuration",
  description: "Site-wide identity and search metadata used throughout the portfolio.",
});

export const buildSchema = schema.extend({
  favicon: z.union([
    z.literal(""),
    z.url("Favicon must be a valid URL"),
  ]),
  websiteName: z.string(),
  fullName: z.string(),
  template: z.string(),
}).partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  favicon: "",
  websiteName: "",
  fullName: "",
  seoDescription: "",
  seoKeywords: [],
  template: "default",
};
