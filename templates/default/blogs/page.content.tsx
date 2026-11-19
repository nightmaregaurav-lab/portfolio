import {NotebookPen} from "lucide-react";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {BlogsList} from "./components/BlogsList";
import BlogCard from "./components/BlogCard";
import styles from "./page.module.css";
import type {PageContentProps} from "@/app/(app)/blogs/page.types";

const ITEMS_PER_SECTION = 10;
const MIN_SECTION_THRESHOLD = 3;
const MAX_CATEGORIES_SHOWN = 3;

function PageContent({blogsConfig}: PageContentProps) {
  const posts = blogsConfig.posts || [];
  const hasPosts = posts.length > 0;

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  const recentPosts = sortedPosts.slice(0, ITEMS_PER_SECTION);

  const postsByCategory = (() => {
    const map = new Map<string, typeof sortedPosts>();
    for (const post of sortedPosts) {
      for (const category of post.categories || []) {
        const existing = map.get(category) || [];
        existing.push(post);
        map.set(category, existing);
      }
    }
    return map;
  })();

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
            <BlogsList posts={sortedPosts} />
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

export default PageContent;
