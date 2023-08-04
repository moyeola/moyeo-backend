import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileCategory, parseFileCategoryPath } from './types/fileCategory';
import * as AWS from 'aws-sdk';

@Injectable()
export class FileService {
  async uploadFile(fileCategory: FileCategory, file: any) {
    if (!file) {
      throw new NotFoundException({
        code: 'file_not_found',
      });
    }

    const fileName = `${Date.now()}`;
    const filePath = parseFileCategoryPath(fileCategory);

    try {
      await new AWS.S3()
        .putObject({
          Key: fileName,
          Body: file.buffer,
          Bucket: process.env.AWS_BUCKET_NAME + file,
        })
        .promise();
      return process.env.AWS_S3_URL + filePath + '/' + fileName;
    } catch (error) {
      throw new ForbiddenException({
        code: 'file_upload_failed',
      });
    }
  }
}
