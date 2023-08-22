import { IsNotEmpty, IsString } from 'class-validator';

export class PostDevAuthReqDto {
    @IsString()
    @IsNotEmpty()
    masterToken: string;

    @IsString()
    @IsNotEmpty()
    developerName: string;
}
