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
  const slugs = BlogsConfig
    .posts
    .flatMap(x => x.slugs)
    .map(x => x.slug);

  return [
    ...slugs.map((slug) => ({blogSlug: slug})),
    {blogSlug: "__404__"},
  ];
}

const emptyBlog: BlogModel = {content: ""};
function findBlogPost(postSlug: string){
  const metadata = BlogsConfig
    .posts
    .find((post) => post.slugs.findIndex(x => x.slug == postSlug) != -1);
  if(!metadata){
    return null;
  }

  const blogContentDirectory = join(getConfigurationDirectory(), "blogs");
  let content: BlogModel;
  try {
    const fileContent = readFileSync(join(blogContentDirectory, metadata.id + ".json"), "utf8");
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
  {params}: { params: Promise<{blogSlug: string}>; }
) {
  const {blogSlug} = await params;
  const post = findBlogPost(blogSlug);
  if (!post) {
    return {};
  }

  return createPageMetadata({
    title: post.title,
    description: stripHtmlTags(post.summary || post.content).slice(0, 300),
    path: "/blogs/" + blogSlug + "/",
    image: CoreConfig.favicon,
    keywords: post.tags,
    type: "article",
    publishedTime: post.date,
    section: post.categories[0],
    tags: post.tags,
  });
}

export default async function Page(
  {params}: { params: Promise<{blogSlug: string}>; }
) {
  const {blogSlug} = await params;
  const post = findBlogPost(blogSlug);
  if (!post) {
    notFound();
  }

  const canonical = getCanonicalUrl("/blogs/" + blogSlug + "/");
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
