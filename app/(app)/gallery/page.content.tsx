"use client"

import React from 'react';
import styles from "./page.module.css";
import {TModel as GalleryModel} from "@/configuration/gallery";
import {cn} from "@/lib/utils";
import {Folder, Images} from "lucide-react";
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {getActiveSlug} from "@/lib/slugs";

export const uncategorizedGalleryCategory = {
  name: "Uncategorized",
  slugs: [{slug: "uncategorized", isActive: true}],
  coverImage: "",
  description: "Photos that are not part of a specific collection."
};

export function getCollectionPhotos(collectionName: string, photos: GalleryModel["photos"]) {
  if(collectionName === uncategorizedGalleryCategory.name) {
    return photos.filter((photo) => !photo.categories || photo.categories.length === 0);
  }
  return photos.filter((photo) => photo.categories?.includes(collectionName));
}

export function getCollectionCover(collectionName: string, photos: GalleryModel["photos"], coverImage?: string) {
  if (coverImage) {
    return coverImage;
  }

  const images = getCollectionPhotos(collectionName, photos);
  if(images.length) {
    return images[0].url;
  }
  return null;
}

function PageContent(
  {galleryConfig}: {
    galleryConfig: GalleryModel
  }
) {
  if (!galleryConfig.photos.length && !galleryConfig.categories.length) {
    return (
      <main className={cn(styles.page)}>
        <div className={styles.headingRow}>
          <h1 className={styles.pageHeader}>Gallery</h1>
        </div>
        <HtmlRenderer className={styles.pageText}>{galleryConfig.summary}</HtmlRenderer>
        <div className={styles.emptyState}>
          <Images className={styles.emptyIcon} aria-hidden="true" />
          No photos yet.
        </div>
      </main>
    );
  }

  return (
    <>
      <main className={cn(styles.page)}>
        <div className={styles.headingRow}>
          <h1 className={styles.pageHeader}>Gallery</h1>
        </div>
          <HtmlRenderer className={styles.pageText}>{galleryConfig.summary}</HtmlRenderer>
        <div className={styles.folderGrid}>
          {[...galleryConfig.categories, uncategorizedGalleryCategory]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((collection, index) => {
              const cover = getCollectionCover(collection.name, galleryConfig.photos, collection.coverImage);
              const photoCount = getCollectionPhotos(collection.name, galleryConfig.photos).length;

              return (
                <SmartLink
                  href={"/gallery/" + getActiveSlug(collection.slugs) + "/"}
                  key={index}
                  className={styles.folderCard}
                >
                  <span className={styles.folderCover}>
                    {cover
                      ? <img src={cover} alt="" className={styles.folderImage} />
                      : <Folder className={styles.folderPlaceholder} aria-hidden="true" />}
                  </span>
                  <span className={styles.folderDetails}>
                    <span className={styles.folderName}><Folder size={18} />{collection.name}</span>
                    <span className={styles.folderCount}>
                      {photoCount} {photoCount === 1 ? "photo" : "photos"}
                    </span>
                  </span>
                </SmartLink>
              );
            })}
        </div>
      </main>
    </>
  );
}

export default PageContent;
