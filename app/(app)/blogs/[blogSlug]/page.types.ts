import type { TModel as BlogModel } from "@/configuration/blog";
import type { TModel as BlogsModel } from "@/configuration/blogs";

export type BlogPost = BlogsModel["posts"][number] & BlogModel;

export interface PageContentProps {
  post: BlogPost;
  authorName: string;
}
