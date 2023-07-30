import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthReqDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
