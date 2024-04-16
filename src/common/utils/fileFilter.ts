import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {

  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    // Verifica la extensión del archivo
    return callback(
      new BadRequestException('Only JPG, JPEG, or PNG files are allowed'),
      false,
    );
  }

  if (file.size > 1000000) {
    // Verifica el tamaño del archivo (en bytes)
    return callback(
      new BadRequestException('File size must be less than 1MB'),
      false,
    );
  }

  callback(null, true);
};
