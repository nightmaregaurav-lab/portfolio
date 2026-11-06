import {notFound} from "next/navigation";
import StructuredData from "@/components/StructuredData";
import {CoreConfig, GalleryConfig} from "@/configuration";
import {createPageMetadata, getCanonicalUrl} from "@/lib/pageMetadata";
import {stripHtmlTags} from "@/lib/html";
import PageContent from "./page.content";
import {getCollectionCover, getCollectionPhotos} from "../page.content";
import type {GalleryCollection} from "./page.types";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...GalleryConfig.categories.map((collection) => ({collectionName: collection.name})),
    {collectionName: "__404__"},
  ];
}

function findCollection(collectionName: string) {
  const metadata = GalleryConfig
    .categories
    .find((collection) => collection.name === collectionName);
  if(!metadata){
    return null;
  }

  const cover = getCollectionCover(collectionName, GalleryConfig.photos, metadata.coverImage);
  const photos = getCollectionPhotos(collectionName, GalleryConfig.photos);
  return {
    ...metadata,
    cover,
    photos
  } as GalleryCollection
}

export async function generateMetadata(
  {params}: { params: Promise<{collectionName: string}>; }
) {
  const {collectionName} = await params;
  const collection = findCollection(collectionName);
  if (!collection) {
    return {};
  }

  return createPageMetadata({
    title: collection.name + " | Gallery",
    description: stripHtmlTags(collection.description || collection.photos.length + " photos in the " + collection.name + " collection.").slice(0, 300),
    path: "/gallery/" + collectionName + "/",
    image: collection.cover || CoreConfig.favicon,
  });
}

export default async function Page(
  {params}: { params: Promise<{collectionName: string}>; }
) {
  const {collectionName} = await params;
  const collection = findCollection(collectionName);
  if (!collection) {
    notFound();
  }

  const canonical = getCanonicalUrl("/gallery/" + collectionName + "/");
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
