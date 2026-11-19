"use client";

import { Search } from "lucide-react";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import type { TModel as BlogsModel } from "@/configuration/blogs";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import styles from "../page.module.css";
import BlogCard from "./BlogCard";

function getSearchablePostText(post: BlogsModel["posts"][number]) {
  return [
    post.title,
    post.summary,
    post.id,
    ...post.slugs.map(({ slug }) => slug),
    ...(post.categories || []),
    ...(post.tags || []),
  ]
    .join(" ")
    .replaceAll(/<[^>]*>/g, " ")
    .toLocaleLowerCase();
}

function BlogsList({ posts }: { posts: BlogsModel["posts"] }) {
  const {
    state: searchTerm,
    debouncedState: debouncedSearchTerm,
    setState: setSearchTerm,
  } = useDebouncedState("", 300);

  const allPosts = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLocaleLowerCase();
    if (!query) return posts;
    return posts.filter((post) => getSearchablePostText(post).includes(query));
  }, [posts, debouncedSearchTerm]);

  return (
    <>
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
    </>
  );
}

export { default as BlogCard } from "./BlogCard";
export { BlogsList };
