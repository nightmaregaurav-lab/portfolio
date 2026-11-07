import * as z from "zod";

export const schema = z.object({
  content: z.string().min(1, "Content is required.").default("").meta({
    title: "Content",
    description: "The actual HTML content of the blog post."
  })
}).meta({
  title: "Blog Post",
  description: "Actual blog post content."
});

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  content: ""
};
