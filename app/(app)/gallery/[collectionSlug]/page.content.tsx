"use client";

import React, {useState} from "react";
import {ArrowLeft, Eye, Images} from "lucide-react";
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import ImageLightbox from "@/components/ui/ImageLightbox";
import type {GalleryCollection} from "./page.types";
import styles from "./page.module.css";

function PageContent(
  {collection}: {
    collection: GalleryCollection
  }
) {
  return (
    <main className={styles.page} aria-label={`${collection.name} collection`}>
      <header className={styles.intro}>
        <SmartLink href="/gallery/" className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden="true"/> Back to gallery
        </SmartLink>
        <h1 className={styles.pageHeader}>{collection.name}</h1>
        {collection.description?.trim() && (
          <HtmlRenderer className={styles.summary}>{collection.description}</HtmlRenderer>
        )}
      </header>

      {collection.photos.length ? (
        <section className={styles.photoGrid} aria-label={collection.name + " photos"}>
          {collection.photos.map((photo, index) => {
            const imageName = photo.title || "Untitled Photo";
            const imageUrl = photo.url;
            const [isHovered, setIsHovered] = useState(false);
            const [lightboxOpen, setLightboxOpen] = useState(false);

            return (
              <article
                className={styles.photoCard}
                data-size={index % 5 === 0 ? "wide" : "regular"}
                data-hovered={isHovered ? "true" : "false"}
                key={photo.id + "-" + index}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(prev => !prev)}
              >
                <ImageLightbox
                  src={imageUrl}
                  name={imageName}
                  open={lightboxOpen}
                  onOpenChange={setLightboxOpen}
                >
                  <img
                    className={styles.photoImage}
                    src={imageUrl}
                    alt={imageName}
                    onClick={() => setLightboxOpen(true)}
                  />
                </ImageLightbox>
                {(photo.title || photo.caption || (photo.categories && photo.categories.length)) && (
                  <div className={styles.photoText}>
                    {photo.categories && photo.categories.length && (
                      <div className={styles.photoCategories}>
                        {photo.categories.map((category) => (
                          <span className={styles.photoCategory} key={category}>{category}</span>
                        ))}
                      </div>
                    )}
                    {photo.title && <h2 className={styles.photoTitle}>{photo.title}</h2>}
                    {photo.caption && <p className={styles.photoCaption}>{photo.caption}</p>}
                  </div>
                )}
                <button
                  className={styles.viewButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  aria-label={`View ${imageName}`}
                >
                  <Eye size={24} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </section>
      ) : (
        <section className={styles.emptyState} aria-label="Collection photos">
          <Images size={26} aria-hidden="true"/>
          <h2>No photos in this collection.</h2>
          <p>Images added to this collection will show up here.</p>
        </section>
      )}
    </main>
  );
}

export default PageContent;
