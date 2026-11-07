import {readFileSync} from "node:fs";
import {join} from "node:path";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, BlogsConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import PageContent from "./page.content";
import type {BlogPost} from "./page.types";
import {TModel as BlogModel} from "@/configuration/blog";
import {getConfigurationDirectory} from "@/configuration/configurationFiles";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...BlogsConfig.posts.map((post) => ({blogId: post.id})),
    {blogId: "__404__"},
  ];
}

const emptyBlog: BlogModel = {content: ""};
function findBlogPost(postId: string){
  const metadata = BlogsConfig
    .posts
    .find((post) => post.id === postId);
  if(!metadata){
    return null;
  }

  const blogContentDirectory = join(getConfigurationDirectory(), "blogs");
  let content: BlogModel;
  try {
    const fileContent = readFileSync(join(blogContentDirectory, postId + ".json"), "utf8");
    content = JSON.parse(fileContent) as BlogModel;
  } catch {
    content = emptyBlog;
  }

  return {
    ...metadata,
    ...content
  } as BlogPost
}

export async function generateMetadata(
  {params}: { params: Promise<{blogId: string}>; }
) {
  const {blogId} = await params;
  const post = findBlogPost(blogId);
  if (!post) {
    return {};
  }

  return createPageMetadata({
    title: post.title,
    description: stripHtmlTags(post.summary || post.content).slice(0, 300),
    path: "/blogs/" + blogId + "/",
    image: CoreConfig.favicon,
    keywords: post.tags,
    type: "article",
  });
}

export default async function Page(
  {params}: { params: Promise<{blogId: string}>; }
) {
  const {blogId} = await params;
  const post = findBlogPost(blogId);
  if (!post) {
    notFound();
  }

  const canonical = getCanonicalUrl("/blogs/" + blogId + "/");
  return (
    <>
      <PageContent
        post={post}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: stripHtmlTags(post.summary || post.content).slice(0, 300),
        datePublished: post.date,
        articleSection: post.categories,
        keywords: post.tags,
        ...(canonical ? {url: canonical} : {}),
        author: {"@type": "Person", name: CoreConfig.fullName},
      }} />
    </>
  );
}
