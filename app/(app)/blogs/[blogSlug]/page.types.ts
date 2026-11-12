import type {TModel as BlogsModel} from "@/configuration/blogs";
import type {TModel as BlogModel} from "@/configuration/blog";

export type BlogPost = BlogsModel["posts"][number] & BlogModel;

export interface PageContentProps {
  post: BlogPost;
  authorName: string;
}
