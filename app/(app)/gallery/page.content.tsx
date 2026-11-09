"use client";

import React from "react";
import {Images} from "lucide-react";
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import type {TModel as GalleryModel} from "@/configuration/gallery";
import {getActiveSlug} from "@/lib/slugs";
import styles from "./page.module.css";
import {getCollectionCover, getCollectionPhotos} from "./[collectionSlug]/page.utils";

export const uncategorizedGalleryCategory = {
  name: "Uncategorized",
  slugs: [{slug: "uncategorized", isActive: true}],
  coverImage: "",
  description: "Photos that are not part of a specific collection."
};

function PageContent(
  {galleryConfig}: {
    galleryConfig: GalleryModel
  }
) {
  const collections = [...galleryConfig.categories, uncategorizedGalleryCategory]
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!galleryConfig.photos.length && !galleryConfig.categories.length) {
    return (
      <main className={styles.page}>
        <header className={styles.intro}>
          <h1 className={styles.pageHeader}>Gallery</h1>
          <HtmlRenderer className={styles.summary}>{galleryConfig.summary}</HtmlRenderer>
        </header>
        <section className={styles.emptyState} aria-label="Gallery">
          <Images size={28} aria-hidden="true"/>
          <h2>No photos yet.</h2>
          <p>Collections and images will appear here once they are added...</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.pageHeader}>Gallery</h1>
        <HtmlRenderer className={styles.summary}>{galleryConfig.summary}</HtmlRenderer>
      </header>

      <section className={styles.collectionGrid} aria-label="Photo collections">
        {collections.map((collection, index) => {
          const cover = getCollectionCover(collection.name, galleryConfig.photos, collection.coverImage);
          const photoCount = getCollectionPhotos(collection.name, galleryConfig.photos).length;

          return (
            <SmartLink
              href={"/gallery/" + getActiveSlug(collection.slugs) + "/"}
              key={getActiveSlug(collection.slugs) + "-" + index}
              className={styles.collectionCard}
              data-featured={index === 0 ? "true" : "false"}
            >
              <span className={styles.collectionMedia}>
                {cover ? (
                  <img src={cover} alt="" className={styles.collectionImage}/>
                ) : (
                  <span className={styles.collectionPlaceholder} aria-hidden="true">
                    <Images size={36}/>
                  </span>
                )}
              </span>
              <span className={styles.collectionOverlay}>
                <span className={styles.collectionName}>{collection.name}</span>
                <span className={styles.collectionCount}>
                  {photoCount} {photoCount === 1 ? "photo" : "photos"}
                </span>
              </span>
            </SmartLink>
          );
        })}
      </section>
    </main>
  );
}

export default PageContent;
