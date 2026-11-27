import { ArrowLeft } from "lucide-react";
import type { PageContentProps } from "@/app/(app)/blogs/[blogSlug]/page.types";
import { buttonVariants } from "@/components/ui/buttonVariants";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import SmartLink from "@/components/ui/SmartLink";
import { cn, formatDate } from "@/lib/utils";
import styles from "./page.module.css";

function PageContent({ post, authorName }: PageContentProps) {
  const tags = post.tags.filter((tag) => !post.categories.includes(tag));

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <SmartLink
          href="/blogs/"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            styles.backLink,
          )}
          aria-label="Back to all posts"
        >
          <ArrowLeft aria-hidden="true" /> All posts
        </SmartLink>
        <header className={styles.articleHeader}>
          <h1>{post.title}</h1>
          <div className={styles.postMeta}>
            <time className={styles.postDate} dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <p className={styles.pageText}>{post.summary}</p>
          {!!post.categories.length && (
            <div className={styles.tagList}>
              {post.categories.map((category) => (
                <span className={styles.tag} key={category}>
                  {category}
                </span>
              ))}
            </div>
          )}
          {!!tags.length && (
            <div className={styles.tagList}>
              {tags.map((tag) => (
                <span className={styles.tag} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <HtmlRenderer className={styles.articleContent}>
          {post.content}
        </HtmlRenderer>
      </article>
    </main>
  );
}

export default PageContent;
