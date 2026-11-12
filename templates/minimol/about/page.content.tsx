"use client"

import Image from "next/image";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import ImageLightbox from "@/components/ui/ImageLightbox";
import SmartText from "@/components/ui/SmartText";
import type {PageContentProps} from "@/app/(app)/about/page.types";
import styles from "./page.module.css";

export default function PageContent({coreConfig, aboutConfig}: PageContentProps) {
  const heroPicture = aboutConfig.heroPicture?.trim();

  return (
    <article className={styles.page} aria-label="About">
      <header className={styles.header}>
        <h1>About me.</h1>
      </header>
      <div className={styles.body}><HtmlRenderer>{aboutConfig.summary}</HtmlRenderer></div>

      {heroPicture && <ImageLightbox
        src={heroPicture}
        name={coreConfig.fullName}
        trigger={
          <button type="button" className={styles.photoButton} aria-label={`View photo of ${coreConfig.fullName}`}>
            <Image src={heroPicture} alt={`Photo of ${coreConfig.fullName}`} width={640} height={480} className={styles.photo} />
          </button>
        }
      />}

      {aboutConfig.keypoints.length > 0 && <dl className={styles.details}>
        {aboutConfig.keypoints.map((keypoint, index) => <div key={index}>
          <dt>{keypoint.title}</dt>
          <dd><SmartText>{keypoint.value}</SmartText></dd>
        </div>)}
      </dl>}

      {aboutConfig.additionalInformation && <section className={styles.additional} aria-label="Additional information">
        <HtmlRenderer>{aboutConfig.additionalInformation}</HtmlRenderer>
      </section>}
    </article>
  );
}
