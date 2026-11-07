import * as z from "zod";

export const schema = z.object({
  summary: z.string().min(1, "Summary is required.").meta({
    title: "Summary",
    description: "Introductory text displayed at the top of the testimonials page and used as its search result description.",
  }),
  testimonials: z.array(
    z.object({
      by: z.string().min(1, "Author is required.").meta({
        title: "Author",
        description: "The person who gave the testimonial.",
      }),
      date: z.string().min(1, "Date is required.").meta({
        title: "Date",
        description: "The date the testimonial was given or published.",
      }),
      title: z.string().optional().meta({
        title: "Title",
        description: "An optional heading for the testimonial.",
      }),
      image: z.string().optional().meta({
        title: "Image",
        description: "An optional image associated with the testimonial or its author.",
      }),
      text: z.string().min(1, "Testimonial is required.").meta({
        title: "Testimonial",
        description: "The testimonial text.",
      }),
      company: z.string().optional().meta({
        title: "Company",
        description: "The company associated with the author, if applicable.",
      }),
      companyWebsite: z.string().optional().meta({
        title: "Company Website",
        description: "The website of the associated company, if available.",
      }),
      department: z.string().optional().meta({
        title: "Department",
        description: "The department associated with the author, if applicable.",
      }),
      departmentWebsite: z.string().optional().meta({
        title: "Department Website",
        description: "The website of the associated department, if available.",
      }),
    }).meta({
      title: "Testimonial",
      description: "A testimonial and optional details about its author.",
    }),
  ).default([]).meta({
    title: "Testimonials",
    description: "The testimonials to display on the portfolio.",
  }),
}).meta({
  title: "Testimonials Configuration",
  description: "Configuration for the testimonials page and its testimonials.",
});

export const buildSchema = schema.extend({
  summary: z.string()
}).partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  summary: "",
  testimonials: [],
};
