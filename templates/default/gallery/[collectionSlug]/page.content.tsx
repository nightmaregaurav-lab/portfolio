import {ArrowLeft, Images} from "lucide-react";
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import PhotoCard from "@/templates/default/gallery/[collectionSlug]/components/PhotoCard";
import styles from "./page.module.css";
import type {PageContentProps} from "@/app/(app)/gallery/[collectionSlug]/page.types";

function PageContent({collection}: PageContentProps) {
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
          {collection.photos.map((photo, index) => (
            <PhotoCard key={photo.id + "-" + index} photo={photo} index={index} />
          ))}
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
