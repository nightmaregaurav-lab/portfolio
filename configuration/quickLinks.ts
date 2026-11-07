import * as z from "zod";

export const schema = z.object({
  links: z.array(
    z.object({
      title: z.string().min(1, "Title is required.").default("").meta({
        title: "Title",
        description: "The label shown for this download.",
      }),
      icon: z.string().min(1, "Icon is required.").default("").meta({
        title: "Icon",
        description: "The icon to show alongside the download link.",
      }),
      link: z.string().min(1, "Link is required.").default("").meta({
        title: "Link",
        description: "The URL or path of the downloadable file.",
      })
    }).meta({
      title: "Download Link",
      description: "A file or resource that visitors can download.",
    }),
  ).default([]).meta({
    title: "Download Links",
    description: "A list of downloadable files and resources.",
  }),
}).meta({
  title: "Downloads Configuration",
  description: "Configuration for the downloads available on the portfolio.",
});

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  links: [],
};
