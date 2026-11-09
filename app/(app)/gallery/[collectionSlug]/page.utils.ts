import {uncategorizedGalleryCategory} from "../page.content";
import type {TModel as GalleryModel} from "@/configuration/gallery";

export function getCollectionPhotos(collectionName: string, photos: GalleryModel["photos"]) {
  if (collectionName === uncategorizedGalleryCategory.name) {
    return photos.filter((photo) => !photo.categories || photo.categories.length === 0);
  }
  return photos.filter((photo) => photo.categories?.includes(collectionName));
}

export function getCollectionCover(collectionName: string, photos: GalleryModel["photos"], coverImage?: string) {
  if (coverImage && collectionName !== uncategorizedGalleryCategory.name) {
    return coverImage;
  }

  const images = getCollectionPhotos(collectionName, photos);
  if (images.length) {
    return images[0].url;
  }

  if(collectionName === uncategorizedGalleryCategory.name) {
    return coverImage;
  }

  return null;
}
