"use client"

import React from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import SmartText from "@/components/ui/SmartText";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {cn} from "@/lib/utils";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {TModel as CoreModel} from "@/configuration/core";
import {TModel as AboutModel} from "@/configuration/about";
import ImageLightbox from "@/components/ui/ImageLightbox";

function PageContent(
  {coreConfig, aboutConfig}: {
    coreConfig: CoreModel;
    aboutConfig: AboutModel;
  }
) {
  return (
    <main className={cn(styles.page)}>
      <h1 className={styles.pageHeader}>About</h1>
      <HtmlRenderer className={styles.pageText}>{aboutConfig.summary}</HtmlRenderer>
      <div className={styles.pageContent}>
        <AspectRatio ratio={16 / 9} className="w-full max-w-sm rounded-lg bg-muted">
          <ImageLightbox
            src={aboutConfig.heroPicture}
            name={`${coreConfig.fullName}`}
            trigger={
              <Image
                className={styles.pagePhoto}
                src={aboutConfig.heroPicture}
                alt={coreConfig.fullName}
                width={200}
                height={200}
                style={{objectFit: "cover", width: "100%", height: "auto"}}
              />
            }
          />
        </AspectRatio>
        <div className={styles.keypoints}>
          {aboutConfig.keypoints.map((keypoint) => (
            <div className={styles.keypoint} key={keypoint.title.replaceAll(/[^a-zA-Z0-9-_]/g, "")}>
              <span className={styles.keypointHead}>{keypoint.title}:</span>
              <SmartText className={styles.keypointValue}>{keypoint.value}</SmartText>
            </div>
          ))}
        </div>
      </div>
      {aboutConfig.additionalInformation && (
        <section className={styles.additional} aria-label="Additional information">
          <HtmlRenderer className={styles.additionalText}>{aboutConfig.additionalInformation}</HtmlRenderer>
        </section>
      )}
    </main>
  );
}

export default PageContent;
