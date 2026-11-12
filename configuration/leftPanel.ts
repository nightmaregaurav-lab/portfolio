import * as z from "zod";

export const schema = z.object({
  profilePicture: z
    .url("Profile Picture must be a valid URL")
    .min(1, "Profile picture URL is required.")
    .meta({
      title: "Profile Picture",
      description:
        "An image that will be used as the profile picture in the left panel. " +
        "It is recommended to use a square image of size 512x512px.",
    }),
  socials: z
    .array(
      z.object({
        name: z
          .string("Social Media Name is required")
          .min(1, "Social media name is required.")
          .meta({
            title: "Social Media Name",
            description: "The name of the social media account.",
          }),
        url: z
          .url("Social URL must be a valid URL")
          .min(1, "Social media URL is required.")
          .meta({
            title: "Social Media URL",
            description: "The URL of the social media account.",
          }),
      }).meta({
        title: "Social Media Account",
        description: "A social media account.",
      }),
    )
    .default([])
    .meta({
      title: "Social Media Accounts",
      description: "A list of social media accounts to show in the left panel.",
    }),
  enabledMenus: z
    .array(z.string().min(1, "Menu name is required.").meta({
      title: "Menu Name",
      description:
        "The menu key (e.g., home, about, projects, blogs). " +
        "When disabled, the menu item is hidden from the left panel, " +
        "the page is removed from the sitemap, and the path is disallowed in robots.txt " +
        "(including child routes for blogs, projects, and gallery).",
    }))
    .default([])
    .meta({
      title: "Enabled Menus",
      description:
        "Controls which sections are visible in the left panel navigation, " +
        "included in the sitemap, and allowed by search engine crawlers. " +
        "Disabling a menu hides it from navigation, removes it from the sitemap, " +
        "and blocks crawlers from indexing that page and its child routes.",
    }),
}).meta({
  title: "Left Panel Configuration",
  description: "Configuration for the profile, social links, and menu shown in the left panel.",
});

export const buildSchema = schema.extend({
  profilePicture: z.union([
    z.literal(""),
    z.url("Profile Picture must be a valid URL"),
  ]),
}).partial();

export type TInput = z.input<typeof schema>;
export type TOutput = z.output<typeof schema>;
export type TModel = TOutput;

export const defaultValues: TInput = {
  profilePicture: "",
  socials: [],
  enabledMenus: [],
};
