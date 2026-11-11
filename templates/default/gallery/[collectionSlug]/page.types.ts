import {TModel as GalleryModel} from "@/configuration/gallery";


export type GalleryCollection = GalleryModel["categories"][number] & {
  cover: string | null | undefined;
  photos: GalleryModel["photos"]
}
