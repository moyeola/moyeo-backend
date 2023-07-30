import { IsArray, IsNumber } from 'class-validator';

export class PostAccessTokenReqDto {
  @IsNumber()
  userId: number;

  @IsArray()
  permissions: string[];
}
