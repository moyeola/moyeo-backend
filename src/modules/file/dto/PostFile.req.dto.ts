import { IsEnum } from 'class-validator';
import { FileCategory } from '../types/fileCategory';

export class PostFileReqDto {
  @IsEnum(FileCategory)
  category: FileCategory;
}
