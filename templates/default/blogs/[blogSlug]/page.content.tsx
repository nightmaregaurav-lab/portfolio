"use client"

import React from 'react';
import styles from "./page.module.css";
import SmartLink from "@/components/ui/SmartLink";
import {ArrowLeft} from "lucide-react";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {formatDate} from "@/lib/utils";
import type {PageContentProps} from "@/app/(app)/blogs/[blogSlug]/page.types";

function PageContent({post, authorName}: PageContentProps) {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <SmartLink href="/blogs/" className={styles.backLink}>
          <ArrowLeft size={16} /> All posts
        </SmartLink>
        <header className={styles.articleHeader}>
          <h1>{post.title}</h1>
          <div className={styles.postMeta}>
            <time className={styles.postDate} dateTime={post.date}>{formatDate(post.date)}</time>
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <p className={styles.pageText}>{post.summary}</p>
          {!!post.categories.length && (
            <div className={styles.tagList}>
              {post.categories.map((category) => (
                <span className={styles.tag} key={category}>{category}</span>
              ))}
            </div>
          )}
          {!!post.tags.length && (
            <div className={styles.tagList}>
              {post.tags.map((tag) => (
                <span className={styles.tag} key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </header>
        <HtmlRenderer className={styles.articleContent}>{post.content}</HtmlRenderer>
      </article>
    </main>
  );
}

export default PageContent;
