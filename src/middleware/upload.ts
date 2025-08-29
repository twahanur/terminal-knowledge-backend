import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      public_id: `blog_${Date.now()}`,
      resource_type: "image",
      folder: "blog-images",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    } as any;
  },
});

export const upload = multer({ storage });
