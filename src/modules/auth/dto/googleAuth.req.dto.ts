import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleAuthReqDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsString()
  redirectUri: string;
}
