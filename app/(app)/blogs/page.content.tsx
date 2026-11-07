"use client"

import React from 'react';
import styles from "./page.module.css";
import {TModel as BlogsModel} from "@/configuration/blogs"
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";

function PageContent(
  {blogsConfig}: {
    blogsConfig: BlogsModel
  }
) {
  return (
    <main className={styles.page}>
      <h1 className={styles.pageHeader}>Blog</h1>
      <HtmlRenderer className={styles.pageText}>{blogsConfig.summary}</HtmlRenderer>
      {blogsConfig.posts ? (
        <div className={styles.postGrid}>
          {blogsConfig.posts.map((post) => (
            <SmartLink href={"/blogs/" + post.id + "/"} className={styles.postLink} key={post.id}>
              <article className={styles.postCard}>
                <time className={styles.postDate} dateTime={post.date}>{post.date}</time>
                <h2>{post.title}</h2>
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
        </div>
      ) : (
        <div className={styles.emptyState}>No blog posts yet.</div>
      )}
    </main>
  );
}

export default PageContent;
