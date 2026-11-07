import * as z from "zod";

export const schema = z.object({
  summary: z
    .string()
    .min(1, "Summary is required.")
    .default("")
    .meta({
      title: "Summary",
      description: "The introduction shown on the About page and used as its search result description.",
    }
  ),
  heroPicture: z
    .url("Please provide a valid URL for the hero picture.")
    .min(1, "Hero picture URL is required.")
    .default("")
    .meta({
      title: "Hero picture",
      description: "The image to use as a featured image in about page.",
    }),
  keypoints: z.array(
    z.object({
      title: z
        .string()
        .min(1, "Key point title is required.")
        .default("")
        .meta({
          title: "Key point title",
          description: "The title of the key point.",
        }),
      value: z
        .string()
        .min(1, "Key point value is required.")
        .default("")
        .meta({
          title: "Key point value",
          description: "The value of the key point. Links, email addresses and phone numbers are automatically detected and converted to clickable links.",
        }),
    }).meta({
      title: "Key point",
      description: "A key point to display on the about page.",
    })).default([]).meta({
      title: "Key points",
      description: "A list of key points to display on the about page.",
    }),
  additionalInformation: z
    .string()
    .optional()
    .meta({
      title: "Additional information",
      description: "Any additional paragraph to display on the about page.",
    }),
}).meta({
  title: "About Configuration",
  description: "Configuration for the About page, including its introduction, image, and key points.",
});

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  summary: "",
  heroPicture: "",
  keypoints: [],
  additionalInformation: "",
};
