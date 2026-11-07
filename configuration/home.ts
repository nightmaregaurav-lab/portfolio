import * as z from "zod";

export const schema = z.object({
  coverPicture: z
    .url("The cover picture must be a valid URL")
    .min(1, "Cover picture URL is required.")
    .meta({
      title: "Cover picture",
      description: "The background image to use in the landing page."
    }
  ),
  bio: z
    .string("Bio is required")
    .min(1, "Bio is required.")
    .meta({
      title: "Bio",
      description: "A really short description about yourself. Job title, role, or a few words about you."
    })
}).meta({
  title: "Home Configuration",
  description: "Configuration for the landing page, including its cover image and short bio.",
});

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  coverPicture: "",
  bio: "",
};
