import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './interface/cloudinary.interface';

const setreamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<CloudinaryResponse[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async destroyFile(url: string): Promise<CloudinaryResponse> {
    const publicId = this.extractPublicId(url);

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  private async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      setreamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private extractPublicId(imageUrl: string): string | null {
    const match = imageUrl.match(/\/([^\/]+\/[^\/]+)$/i);
    if (match) {
      const fileName = match[1];
      const fileNameWithoutExtension = fileName.split('.')[0];
      return fileNameWithoutExtension;
    }
    return null;
  }
}
