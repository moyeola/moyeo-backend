import { IsOptional, IsString } from 'class-validator';

export class PatchCalendarReqDto {
    @IsOptional()
    @IsString()
    name?: string;
}
