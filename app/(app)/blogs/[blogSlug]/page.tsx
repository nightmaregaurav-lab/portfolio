import { join } from "node:path";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";
import { BlogsConfig, CoreConfig, NavigationConfig } from "@/configuration";
import {
  type TOutput as BlogOutput,
  buildSchema as blogSchema,
} from "@/configuration/blog";
import { readConfigurationFromFile } from "@/configuration/configurationFiles";
import { stripHtmlTags } from "@/lib/html";
import { createPageMetadata, getCanonicalUrl } from "@/lib/pageMetadata";
import { getTemplateType, Templates } from "@/lib/templates";
import PageLoading from "../../PageLoading";
import type { BlogPost, PageContentProps } from "./page.types";

const templateType = getTemplateType("blogs/[blogSlug]");
const PageContent =
  templateType === Templates.Client
    ? dynamic<PageContentProps>(
        () =>
          import(
            `@/templates/${CoreConfig.template}/blogs/[blogSlug]/page.content`
          ),
        { ssr: true },
      )
    : templateType === Templates.Server
      ? ((
          await import(
            `@/templates/${CoreConfig.template}/blogs/[blogSlug]/page.content`
          )
        ).default as React.ComponentType<PageContentProps>)
      : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = BlogsConfig.posts.flatMap((x) => x.slugs).map((x) => x.slug);

  return [
    ...slugs.map((slug) => ({ blogSlug: slug })),
    { blogSlug: "__404__" },
  ];
}

const emptyBlog: BlogOutput = { content: "" };
function findBlogPost(postSlug: string) {
  const metadata = BlogsConfig.posts.find(
    (post) => post.slugs.findIndex((x) => x.slug === postSlug) !== -1,
  );
  if (!metadata) {
    return null;
  }

  let content: BlogOutput;
  try {
    content = blogSchema.parse(
      readConfigurationFromFile(join("blogs", `${metadata.id}.json`)),
    ) as BlogOutput;
  } catch {
    content = emptyBlog;
  }

  return {
    ...metadata,
    ...content,
  } as BlogPost;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ blogSlug: string }>;
}) {
  const { blogSlug } = await params;
  const post = findBlogPost(blogSlug);
  if (!post) {
    return {};
  }

  return createPageMetadata({
    title: post.title,
    description: stripHtmlTags(post.summary || post.content).slice(0, 300),
    path: `/blogs/${blogSlug}/`,
    image:
      post.coverImage || NavigationConfig.profilePicture || CoreConfig.favicon,
    keywords: post.tags,
    type: "article",
    publishedTime: post.date,
    section: post.categories[0],
    tags: post.tags,
  });
}

async function Page({ params }: { params: Promise<{ blogSlug: string }> }) {
  const { blogSlug } = await params;
  if (!PageContent) {
    notFound();
  }
  const post = findBlogPost(blogSlug);
  if (!post) {
    notFound();
  }

  const canonical = getCanonicalUrl(`/blogs/${blogSlug}/`);
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <PageContent post={post} authorName={CoreConfig.fullName} />
      </Suspense>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: stripHtmlTags(post.summary || post.content).slice(
            0,
            300,
          ),
          datePublished: post.date,
          articleSection: post.categories,
          keywords: post.tags,
          ...(canonical ? { url: canonical } : {}),
          author: { "@type": "Person", name: CoreConfig.fullName },
        }}
      />
    </>
  );
}

export default Page;
