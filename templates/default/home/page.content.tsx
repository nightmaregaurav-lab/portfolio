"use client"

import React from 'react';
import styles from "./page.module.css";
import {cn} from "@/lib/utils";
import type {PageContentProps} from "@/app/(app)/page.types";


function PageContent({coreConfig, homeConfig}: PageContentProps) {
  return (
    <main className={styles.page} aria-label="Home">
      <div
        className={styles.heroImage}
        style={{backgroundImage: `url("${homeConfig.coverPicture}")`}}
        role="img"
        aria-label={`Hero image of ${coreConfig.fullName}`}
      />
      <div className={styles.heroText}>
        <h1 className={cn(styles.heroTextPrimary, "text-white")}>{coreConfig.fullName}</h1>
        <br/><br/>
        <p className={cn(styles.heroTextSecondary, "text-white")}>{homeConfig.bio}</p>
      </div>
    </main>
  );
}

export default PageContent;
