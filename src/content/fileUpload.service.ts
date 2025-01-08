import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  static multerOptions = {
    storage: diskStorage({
      destination: './uploads/images',
      filename: (req, file, callback) => {
        const filename = uuidv4() + extname(file.originalname);
        callback(null, filename);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        return callback(new Error('Only these types (jpeg, jpg, png, gif) of files are allowed!'), false);
      }
      callback(null, true);
    }
  };
}