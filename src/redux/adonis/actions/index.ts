import { Dispatch } from "react";
import { RootStateOrAny } from "react-redux";
import firebaseConfig from "../../../config/firebase.config";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import {
  AdonisGalleryState,
  DeleteAdonisImageActionTypes,
  DELETE_ADONIS_IMAGE_FAIL,
  DELETE_ADONIS_IMAGE_START,
  DELETE_ADONIS_IMAGE_SUCCESS,
  GetAdonisGalleryPhotosActionTypes,
  GET_ADONIS_GALLERY_PHOTOS_FAIL,
  GET_ADONIS_GALLERY_PHOTOS_START,
  GET_ADONIS_GALLERY_PHOTOS_SUCCESS,
  SetAdonisActivePhotoActionTypes,
  SetAdonisGalleryComponentActionTypes,
  SET_ADONIS_ACTIVE_PHOTO,
  SET_ADONIS_ACTIVE_PHOTO_NULL,
  SET_ADONIS_GALLERY_CLOSE,
  SET_ADONIS_GALLERY_OPEN,
  UploadAdonisPhotoActionTypes,
  UPLOAD_ADONIS_PHOTO_FAIL,
  UPLOAD_ADONIS_PHOTO_START,
  UPLOAD_ADONIS_PHOTO_SUCCESS,
} from "../types";
import Axios, { AxiosResponse } from "axios";
import { storage } from "../../../firebase";
import {
  adonisConfig,
  AdonisImage,
  AdonisOrderedTriple,
} from "../../../config/adonis.config";
import getAdonisOrderedTriple from "../../../helper/getAdonisOrderedTriple";

export const galleryClose = (): SetAdonisGalleryComponentActionTypes => {
  return {
    type: SET_ADONIS_GALLERY_CLOSE,
  };
};

export const galleryOpen = (): SetAdonisGalleryComponentActionTypes => {
  return {
    type: SET_ADONIS_GALLERY_OPEN,
  };
};

export const setActivePhoto = (
  adonisImage: AdonisImage
): SetAdonisActivePhotoActionTypes => {
  return {
    type: SET_ADONIS_ACTIVE_PHOTO,
    payload: {
      fileName: adonisImage.fileName,
      uuid: adonisImage.uuid,
      gallery: adonisImage.gallery,
      gallery_thumbnail: adonisImage.gallery_thumbnail,
      gallery_thumbnail_blur: adonisImage.gallery_thumbnail_blur,
    },
  };
};

export const setActivePhotoNull = (): SetAdonisActivePhotoActionTypes => {
  return {
    type: SET_ADONIS_ACTIVE_PHOTO_NULL,
  };
};

export const getAllImageLinks = (): ThunkAction<
  void,
  RootStateOrAny,
  unknown,
  Action<string>
> => {
  return async (dispatch: Dispatch<GetAdonisGalleryPhotosActionTypes>) => {
    dispatch({
      type: GET_ADONIS_GALLERY_PHOTOS_START,
    });

    try {
      let allThumbnailRefs = await storage
        .ref()
        .child(
          `${adonisConfig.path.rootFolder}/${adonisConfig.path.galleryThumbnail}`
        )
        .listAll();

      let allThumbnailPath = allThumbnailRefs.items;

      let adonisImageGallery: Array<AdonisImage> = [];

      for (let i = 0; i < allThumbnailPath.length; i++) {
        let fileMetadata = await allThumbnailPath[i].getMetadata();

        let adonisOrderedTripleInternal: AdonisOrderedTriple = getAdonisOrderedTriple(
          fileMetadata.name
        );

        let adonisImageInternal: AdonisImage = {
          fileName: fileMetadata.customMetadata.fileName,
          uuid: fileMetadata.customMetadata.uuid,
          gallery: adonisOrderedTripleInternal.gallery,
          gallery_thumbnail: adonisOrderedTripleInternal.gallery_thumbnail,
          gallery_thumbnail_blur:
            adonisOrderedTripleInternal.gallery_thumbnail_blur,
        };

        adonisImageGallery.push(adonisImageInternal);
      }

      dispatch({
        type: GET_ADONIS_GALLERY_PHOTOS_SUCCESS,
        payload: adonisImageGallery,
      });
    } catch (error) {
      dispatch({
        type: GET_ADONIS_GALLERY_PHOTOS_FAIL,
        payload: error.message,
      });
    }
  };
};

export const deleteImage = (): ThunkAction<
  void,
  RootStateOrAny,
  unknown,
  Action<string>
> => {
  return async (dispatch: Dispatch<DeleteAdonisImageActionTypes>, getState) => {
    dispatch({
      type: DELETE_ADONIS_IMAGE_START,
    });

    let currentState: AdonisGalleryState = getState().adonis;

    let selectedImageFull: string = currentState.selectedPhoto.gallery;
    let selectedImageThumbnail: string =
      currentState.selectedPhoto.gallery_thumbnail;
    let selectedImageThumbnailBlur: string =
      currentState.selectedPhoto.gallery_thumbnail_blur;

    try {
      await storage.refFromURL(selectedImageFull).delete();
      await storage.refFromURL(selectedImageThumbnail).delete();
      await storage.refFromURL(selectedImageThumbnailBlur).delete();

      dispatch({
        type: DELETE_ADONIS_IMAGE_SUCCESS,
        payload: {
          deletedImageURL: selectedImageFull,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: DELETE_ADONIS_IMAGE_FAIL,
      });
    }
  };
};

export const uploadAndOptimizeImage = (
  fileName: string,
  base64URI: string
): ThunkAction<void, RootStateOrAny, unknown, Action<string>> => {
  return (dispatch: Dispatch<UploadAdonisPhotoActionTypes>) => {
    dispatch({
      type: UPLOAD_ADONIS_PHOTO_START,
    });

    // TODO - DEFINE CONSTANTS FOR HTTP CALLS THAT CHANGED BASED ON ENV

    let requestURL: string;

    if (process.env.NODE_ENV !== "production") {
      requestURL = `http://localhost:5001/${firebaseConfig.projectId}/${firebaseConfig.locationId}1/api/adonis/optimize`;
    } else {
      requestURL = `https://${firebaseConfig.locationId}1-${firebaseConfig.projectId}.cloudfunctions.net/api/adonis/optimize`;
    }

    Axios.post<AdonisImage, AxiosResponse<AdonisImage>>(requestURL, {
      fileName: fileName,
      base64URI: base64URI,
    })
      .then((uploadSuccessResponse) => {
        console.log(uploadSuccessResponse.data);

        let orderTripleLocal: AdonisImage = {
          fileName: uploadSuccessResponse.data.fileName,
          uuid: uploadSuccessResponse.data.uuid,
          gallery: uploadSuccessResponse.data.gallery,
          gallery_thumbnail: uploadSuccessResponse.data.gallery_thumbnail,
          gallery_thumbnail_blur:
            uploadSuccessResponse.data.gallery_thumbnail_blur,
        };

        dispatch({
          type: UPLOAD_ADONIS_PHOTO_SUCCESS,
          payload: orderTripleLocal,
        });
      })
      .catch((error) => {
        dispatch({
          type: UPLOAD_ADONIS_PHOTO_FAIL,
        });
      });
  };
};
