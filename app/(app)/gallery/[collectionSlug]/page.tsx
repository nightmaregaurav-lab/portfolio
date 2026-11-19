import type React from "react";
import dynamic from "next/dynamic";
import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, GalleryConfig, NavigationConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import {getTemplateType, Templates} from "@/lib/templates";
import type {GalleryCollection, PageContentProps} from "./page.types";
import {
  getCollectionCover,
  getCollectionPhotos,
  uncategorizedGalleryCategory
} from "@/app/(app)/gallery/[collectionSlug]/page.utils";

const templateType = getTemplateType("gallery/[collectionSlug]");
const PageContent = templateType === Templates.Client
  ? dynamic<PageContentProps>(
      () => import(`@/templates/${CoreConfig.template}/gallery/[collectionSlug]/page.content`),
      {ssr: true}
    )
  : templateType === Templates.Server
    ? ((await import(`@/templates/${CoreConfig.template}/gallery/[collectionSlug]/page.content`)).default as React.ComponentType<PageContentProps>)
    : null;

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = GalleryConfig
    .categories
    .flatMap(x => x.slugs)
    .map(x => x.slug);

  return [
    ...slugs.map((slug) => ({collectionSlug: slug})),
    {collectionSlug: "uncategorized"},
  ];
}

function findCollection(collectionSlug: string) {
  const metadata = (collectionSlug === "uncategorized")
    ? uncategorizedGalleryCategory
    : GalleryConfig
      .categories
      .find((collection) => collection.slugs.findIndex(x => x.slug == collectionSlug) != -1);
  if(!metadata){
    return null;
  }

  const cover = getCollectionCover(metadata.name, GalleryConfig.photos, metadata.coverImage);
  const photos = getCollectionPhotos(metadata.name, GalleryConfig.photos);
  return {
    ...metadata,
    cover,
    photos
  } as GalleryCollection
}

export async function generateMetadata(
  {params}: { params: Promise<{collectionSlug: string}>; }
) {
  const {collectionSlug} = await params;
  const collection = findCollection(collectionSlug);
  if (!collection) {
    return {};
  }

  return createPageMetadata({
    title: collection.name + " | Gallery",
    description: stripHtmlTags(collection.description || collection.photos.length + " photos in the " + collection.name + " collection.").slice(0, 300),
    path: "/gallery/" + collectionSlug + "/",
    image: collection.cover || NavigationConfig.profilePicture || CoreConfig.favicon,
  });
}

export default async function Page(
  {params}: { params: Promise<{collectionSlug: string}>; }
) {
  const {collectionSlug} = await params;
  if (!PageContent) {
    notFound();
  }
  const collection = findCollection(collectionSlug);
  if (!collection) {
    notFound();
  }

  const canonical = getCanonicalUrl("/gallery/" + collectionSlug + "/");
  return (
    <>
      <PageContent
        collection={collection}
      />

      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: collection.name,
        description: stripHtmlTags(collection.description || collection.photos.length + " photos in the " + collection.name + " collection.").slice(0, 300),
        ...(collection.cover ? {image: collection.cover} : {}),
        ...(canonical ? {url: canonical} : {}),
        author: {"@type": "Person", name: CoreConfig.fullName},
      }} />
    </>
  );
}
