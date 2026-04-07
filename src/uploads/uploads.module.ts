import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Module({
  imports: [
    MulterModule.register({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
  folder: 'documents',
  resource_type: 'image', // treat PDF as image
  public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
  access_mode: 'public',
})
  }),
})
  ],
  exports: [MulterModule],
})
export class UploadsModule {}
