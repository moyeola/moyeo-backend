import { IsString } from 'class-validator';

export class GoogleAuthReqDto {
  @IsString()
  token: string;
}
