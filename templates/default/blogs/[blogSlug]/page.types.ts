import {TModel as BlogsModel} from "@/configuration/blogs";
import {TModel as BlogModel} from "@/configuration/blog";


export type BlogPost = BlogsModel["posts"][number] & BlogModel
