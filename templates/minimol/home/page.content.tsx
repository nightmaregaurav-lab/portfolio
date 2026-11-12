"use client"

import type {PageContentProps} from "@/app/(app)/page.types";
import styles from "./page.module.css";

export default function PageContent({coreConfig, homeConfig}: PageContentProps) {
  return (
    <article className={styles.page} aria-label="Introduction">
      <header className={styles.hero}>
        <h1>{coreConfig.fullName || coreConfig.websiteName || "Hello there."}</h1>
        {homeConfig.bio && <p className={styles.lead}>{homeConfig.bio}</p>}
      </header>
    </article>
  );
}
