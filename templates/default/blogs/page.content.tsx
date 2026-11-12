"use client";

import React, {useEffect, useMemo} from "react";
import {NotebookPen, Search} from "lucide-react";
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {Input} from "@/components/ui/input";
import {getActiveSlug} from "@/lib/slugs";
import {formatDate} from "@/lib/utils";
import {useDebouncedState} from "@/hooks/useDebouncedState";
import {useRouter, useSearchParams} from "next/navigation";
import styles from "./page.module.css";
import type {PageContentProps} from "@/app/(app)/blogs/page.types";
import type {TModel as BlogsModel} from "@/configuration/blogs";

const RECENT_COUNT = 3;

function getSearchablePostText(post: BlogsModel["posts"][number]) {
  return [
    post.title,
    post.summary,
    post.id,
    ...post.slugs.map(({slug}) => slug),
    ...(post.categories || []),
    ...(post.tags || []),
  ].join(" ").replaceAll(/<[^>]*>/g, " ").toLocaleLowerCase();
}

function PageContent({blogsConfig}: PageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const {
    state: searchTerm,
    debouncedState: debouncedSearchTerm,
    setState: setSearchTerm
  } = useDebouncedState(keyword, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!debouncedSearchTerm.trim()) {
      params.delete("keyword");
    } else {
      params.set("keyword", debouncedSearchTerm);
    }
    router.push(`?${params.toString()}`);
  }, [debouncedSearchTerm]);

  const posts = blogsConfig.posts || [];
  const hasPosts = posts.length > 0;

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [posts]);

  const recentPosts = useMemo(() => sortedPosts.slice(0, RECENT_COUNT), [sortedPosts]);

  const allPosts = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLocaleLowerCase();
    if (!query) return sortedPosts;
    return sortedPosts.filter((post) => getSearchablePostText(post).includes(query));
  }, [sortedPosts, debouncedSearchTerm]);

  return (
    <main className={styles.page} aria-label="Blogs">
      <header className={styles.intro}>
        <h1 className={styles.pageHeader}>Blogs</h1>
        <HtmlRenderer className={styles.summary}>{blogsConfig.summary}</HtmlRenderer>
      </header>

      {hasPosts ? (
        <section className={styles.content} aria-label="Blog posts">
          {recentPosts.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Blogs</h2>
              <div className={styles.postGrid}>
                {recentPosts.map((post, index) => (
                  <BlogCard post={post} index={index} key={post.id} />
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>All Blogs</h2>
              <div className={styles.searchBox}>
                <Search size={17} aria-hidden="true" />
                <Input
                  type="search"
                  aria-label="Search blogs"
                  placeholder="Search by title or summary..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="sr-only" aria-live="polite">
              {allPosts.length} {allPosts.length === 1 ? "post" : "posts"} shown
              {searchTerm.trim() ? ` for "${searchTerm.trim()}"` : ""}
            </div>

            {allPosts.length > 0 ? (
              <div className={styles.postGrid}>
                {allPosts.map((post, index) => (
                  <BlogCard post={post} index={index} key={post.id} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState} role="status">
                {searchTerm.trim()
                  ? `No posts match "${searchTerm.trim()}".`
                  : "No blog posts yet."}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className={styles.emptyState} aria-label="Blog posts">
          <NotebookPen size={26} aria-hidden="true"/>
          <h2>No blog posts yet.</h2>
          <p>Published writing will appear here once posts are added.</p>
        </section>
      )}
    </main>
  );
}

function BlogCard({post}: {post: BlogsModel["posts"][number]; index: number}) {
  const accentColor = post.accentColor || "#FFFFFF";
  const style: Record<string, string> = {};
  style["--accent-tone"] = accentColor;
  return (
    <SmartLink
      href={"/blogs/" + getActiveSlug(post.slugs) + "/"}
      className={styles.postLink}
      aria-label={`Read ${post.title}`}
    >
      <article className={styles.postCard} style={style as React.CSSProperties}>
        <time className={styles.postDate} dateTime={post.date}>{formatDate(post.date)}</time>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.postExcerpt}>{post.summary || "Click to read this post..."}</p>
        {!!post.categories.length && (
          <div className={styles.tagList}>
            {post.categories.map((category) => (
              <span className={styles.tag} key={category}>{category}</span>
            ))}
          </div>
        )}
      </article>
    </SmartLink>
  );
}

export default PageContent;
