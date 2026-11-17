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

const ITEMS_PER_SECTION = 10;
const MIN_SECTION_THRESHOLD = 3;
const MAX_CATEGORIES_SHOWN = 3;

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

  const recentPosts = useMemo(() => sortedPosts.slice(0, ITEMS_PER_SECTION), [sortedPosts]);

  const allPosts = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLocaleLowerCase();
    if (!query) return sortedPosts;
    return sortedPosts.filter((post) => getSearchablePostText(post).includes(query));
  }, [sortedPosts, debouncedSearchTerm]);

  const postsByCategory = useMemo(() => {
    const map = new Map<string, typeof sortedPosts>();
    for (const post of sortedPosts) {
      for (const category of post.categories || []) {
        const existing = map.get(category) || [];
        existing.push(post);
        map.set(category, existing);
      }
    }
    return map;
  }, [sortedPosts]);

  return (
    <main className={styles.page} aria-label="Blogs">
      <header className={styles.intro}>
        <h1 className={styles.pageHeader}>Blogs</h1>
        <HtmlRenderer className={styles.summary}>{blogsConfig.summary}</HtmlRenderer>
      </header>

      {hasPosts ? (
        <section className={styles.content} aria-label="Blog posts">
          {recentPosts.length > MIN_SECTION_THRESHOLD && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Blogs</h2>
              <div className={styles.categoryScroll}>
                {recentPosts.map((post, index) => (
                  <BlogCard post={post} index={index} key={post.id} />
                ))}
              </div>
            </div>
          )}

          {(() => {
            const categories = Array.from(postsByCategory.entries())
              .filter(([, posts]) => posts.length > MIN_SECTION_THRESHOLD)
              .sort(([, a], [, b]) => b.length - a.length)
              .slice(0, MAX_CATEGORIES_SHOWN);

            if (categories.length === 0) return null;

            return (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Categories</h2>
                {categories.map(([category, categoryPosts]) => {
                  const shownPosts = categoryPosts.slice(0, ITEMS_PER_SECTION);
                  return (
                    <div key={category} className={styles.categoryGroup}>
                      <h3 className={styles.categoryTitle}>{category}</h3>
                      <div className={styles.categoryScroll}>
                        {shownPosts.map((post, index) => (
                          <BlogCard post={post} index={index} key={post.id} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

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
        {post.coverImage && (
          <div className={styles.postCoverImage}>
            <img src={post.coverImage} alt="" aria-hidden="true" />
          </div>
        )}
        <time className={styles.postDate} dateTime={post.date}>{formatDate(post.date)}</time>
        <h3 className={styles.postTitle}>{post.title}</h3>
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
