// middleware/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

export const cloudinaryUpload = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folder,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });

  return multer({ storage });
};
