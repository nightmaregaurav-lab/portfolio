import type {TModel as GalleryModel} from "@/configuration/gallery";

export const uncategorizedGalleryCategory = ({
  name: "Uncategorized",
  slugs: [{slug: "uncategorized", isActive: true}],
  coverImage: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Pineapple_Postcards_%28Unsplash%29.jpg",
  description: "Photos that are not part of a specific collection."
});

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
    return images[images.length - 1].url;
  }

  if(collectionName === uncategorizedGalleryCategory.name) {
    return coverImage;
  }

  return null;
}
