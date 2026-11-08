import React from "react";
import styles from "./page.module.css";
import {cn} from "@/lib/utils";
import {CoreConfig, HomeConfig} from "@/configuration";
import {createPageMetadata, getSiteName} from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: getSiteName(),
  description: CoreConfig.seoDescription || HomeConfig.bio,
  path: "/",
  image: HomeConfig.coverPicture || CoreConfig.favicon,
  keywords: CoreConfig.seoKeywords,
});

function Page() {
  return (
    <main className={styles.page}>
      <div
        className={styles.heroImage}
        style={{backgroundImage: `url("${HomeConfig.coverPicture}")`}}
      />
      <div className={styles.heroText}>
        <h1 className={cn(styles.heroTextPrimary, "text-white")}>{CoreConfig.fullName}</h1>
        <br/><br/>
        <p className={cn(styles.heroTextSecondary, "text-white")}>{HomeConfig.bio}</p>
      </div>
    </main>
  );
}

export default Page;
