"use client"

import React from 'react';
import type {GalleryCollection} from "./page.types";
import styles from "./page.module.css";
import { cn } from '@/lib/utils';
import SmartLink from "@/components/ui/SmartLink";
import {buttonVariants} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import ImageLightbox from "@/components/ui/ImageLightbox";

function PageContent(
  {collection}: {
    collection: GalleryCollection
  }
) {
  return (
    <main className={cn(styles.page, "bg-secondary")}>
      <div className={styles.headingRow}>
        <SmartLink href="/gallery/" className={cn(buttonVariants({variant: "outline", size: "sm"}))}>
          <ArrowLeft /> Folders
        </SmartLink>
        <h1 className={styles.pageHeader}>{collection.name}</h1>
      </div>

      {collection.description?.trim() && (
        <HtmlRenderer className={styles.pageText}>{collection.description}</HtmlRenderer>
      )}

      {collection.photos.length ? (
        <div className={styles.photoGrid}>
          {collection.photos.map((photo, index) => {
            const imageName = photo.title || "Untitled Photo";
            const imageUrl = photo.url;
            return (
              <article className={styles.photoCard} key={photo.id || photo.url + "-" + index}>
                <ImageLightbox
                  src={imageUrl}
                  name={imageName}
                  trigger={<img className={styles.photoImage} src={imageUrl} alt={imageName} />}
                />
                {(photo.title || photo.caption) && (
                  <div className={styles.photoText}>
                    {photo.title && <h2 className={styles.photoTitle}>{photo.title}</h2>}
                    {photo.caption && <p className={styles.photoCaption}>{photo.caption}</p>}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>This folder does not have any photos yet.</div>
      )}
    </main>
  );
}

export default PageContent;
