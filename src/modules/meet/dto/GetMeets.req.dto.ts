import { IsOptional, IsString } from 'class-validator';

export class GetMeetsReqDto {
    @IsOptional()
    @IsString()
    creatorType?: 'user' | 'member' | 'group';

    @IsOptional()
    @IsString()
    creatorId?: number;

    @IsOptional()
    @IsString()
    status?: 'PROGRESSING' | 'CONFIRMED' | 'CANCELED';
}
