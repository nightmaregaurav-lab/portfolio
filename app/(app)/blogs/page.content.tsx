"use client";

import React from "react";
import {NotebookPen} from "lucide-react";
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import type {TModel as BlogsModel} from "@/configuration/blogs";
import {getActiveSlug} from "@/lib/slugs";
import styles from "./page.module.css";

function PageContent(
  {blogsConfig}: {
    blogsConfig: BlogsModel
  }
) {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.pageHeader}>Blogs</h1>
        <HtmlRenderer className={styles.summary}>{blogsConfig.summary}</HtmlRenderer>
      </header>

      {blogsConfig.posts && blogsConfig.posts.length > 0 ? (
        <section className={styles.postGrid} aria-label="Blog posts">
          {blogsConfig.posts.map((post, index) => (
            <SmartLink
              href={"/blogs/" + getActiveSlug(post.slugs) + "/"}
              className={styles.postLink}
              data-tone={String(index % 3)}
              key={post.id}
            >
              <article className={styles.postCard}>
                <time className={styles.postDate} dateTime={post.date}>{post.date}</time>
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
          ))}
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
