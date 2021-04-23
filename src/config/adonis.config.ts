import firebaseConfig from "./firebase.config";

export interface AdonisPath {
  rootFolder: string;
  gallery: string;
  galleryThumbnail: string;
  galleryThumbnailBlur: string;
}

export type AdonisOrderedTriple = {
  gallery: string;
  gallery_thumbnail: string;
  gallery_thumbnail_blur: string;
};

export interface AdonisImage extends AdonisOrderedTriple {
  fileName: string;
  uuid: string;
}

export interface AdonisConfig {
  path: AdonisPath;
  createBlur: boolean;
  storageBucketPath: string;
  baseCloudURL: string;
}

export const adonisImagePath: AdonisPath = {
  rootFolder: "adonis",
  gallery: "gallery",
  galleryThumbnail: "gallery_thumbnail",
  galleryThumbnailBlur: "gallery_thumbnail_blur",
};

export const adonisConfig: AdonisConfig = {
  path: adonisImagePath,
  createBlur: true,
  storageBucketPath: firebaseConfig.storageBucket,
  baseCloudURL: "https://firebasestorage.googleapis.com/v0/b/",
};

// DONT FORGET TO REPLICATE CHANGES HERE AT THE ADONIS.CONFIG.TS FILE INSIDE THE ./FUNCTIONS/SRC/CONFIG/
