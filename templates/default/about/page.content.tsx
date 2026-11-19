import Image from "next/image";
import type { PageContentProps } from "@/app/(app)/about/page.types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import ImageLightbox from "@/components/ui/ImageLightbox";
import SmartText from "@/components/ui/SmartText";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

function PageContent({ coreConfig, aboutConfig }: PageContentProps) {
  return (
    <main className={cn(styles.page)} aria-label="About">
      <h1 className={styles.pageHeader}>About</h1>
      <HtmlRenderer className={styles.pageText}>
        {aboutConfig.summary}
      </HtmlRenderer>
      <section className={styles.pageContent}>
        <h2 className="sr-only">Profile details</h2>
        <AspectRatio
          ratio={16 / 9}
          className="w-full max-w-sm rounded-lg bg-muted"
        >
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
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            }
          />
        </AspectRatio>
        <div className={styles.keypoints}>
          {aboutConfig.keypoints.map((keypoint) => (
            <div
              className={styles.keypoint}
              key={keypoint.title.replaceAll(/[^a-zA-Z0-9-_]/g, "")}
            >
              <span className={styles.keypointHead}>{keypoint.title}:</span>
              <SmartText className={styles.keypointValue}>
                {keypoint.value}
              </SmartText>
            </div>
          ))}
        </div>
      </section>
      {aboutConfig.additionalInformation && (
        <section className={styles.additional}>
          <h2 className="sr-only">Additional information</h2>
          <HtmlRenderer className={styles.additionalText}>
            {aboutConfig.additionalInformation}
          </HtmlRenderer>
        </section>
      )}
    </main>
  );
}

export default PageContent;
