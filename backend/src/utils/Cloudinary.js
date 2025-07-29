import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hiretrack",
    resource_type: "raw",
    allowed_formats: ["pdf"],
    public_id: (req, file) => {
      const originalName = file.originalname.split(".")[0].replace(/\s+/g, "_");
      return `resume_${originalName}_${Date.now()}`;
    },
  },
});

export { cloudinary, storage };
