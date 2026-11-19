"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";
import ResponsiveImage from "@/components/ui/ResponsiveImage";
import type { TModel as GalleryModel } from "@/configuration/gallery";
import styles from "../page.module.css";

function PhotoCard({
  photo,
  index,
}: {
  photo: GalleryModel["photos"][number];
  index: number;
}) {
  const imageName = photo.title || "Untitled Photo";
  const imageUrl = photo.url;
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <article
      className={styles.photoCard}
      data-size={index % 5 === 0 ? "wide" : "regular"}
      data-hovered={isHovered ? "true" : "false"}
      key={`${photo.id}-${index}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(event) => {
        if (event.target === event.currentTarget) {
          setIsHovered((prev) => !prev);
        }
      }}
    >
      <ImageLightbox
        src={imageUrl}
        name={imageName}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      >
        <ResponsiveImage
          className={styles.photoImage}
          src={imageUrl}
          alt={imageName}
          style={{ width: "100%", height: "100%" }}
          onClick={() => setLightboxOpen(true)}
        />
      </ImageLightbox>
      {(photo.title ||
        photo.caption ||
        (photo.categories && photo.categories.length > 0)) && (
        <div className={styles.photoText}>
          {photo.categories && photo.categories.length > 0 && (
            <div className={styles.photoCategories}>
              {photo.categories.map((category) => (
                <span className={styles.photoCategory} key={category}>
                  {category}
                </span>
              ))}
            </div>
          )}
          {photo.title && <h3 className={styles.photoTitle}>{photo.title}</h3>}
          {photo.caption && (
            <p className={styles.photoCaption}>{photo.caption}</p>
          )}
        </div>
      )}
      <button
        type="button"
        className={styles.viewButton}
        onClick={(event) => {
          event.stopPropagation();
          setLightboxOpen(true);
        }}
        onTouchStart={(event) => {
          event.stopPropagation();
        }}
        aria-label={`View ${imageName}`}
      >
        <Eye size={24} aria-hidden="true" />
      </button>
    </article>
  );
}

export default PhotoCard;
