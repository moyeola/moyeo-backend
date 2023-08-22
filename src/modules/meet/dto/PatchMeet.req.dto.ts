import { CommonConstant } from '@/entity/constant/common.constant';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchMeetReqDto {
    @IsOptional()
    @IsString()
    @MaxLength(CommonConstant.MEET_TITLE_MAX_LENGTH)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(CommonConstant.MEET_DESCRIPTION_MAX_LENGTH)
    description?: string;

    @IsOptional()
    @IsArray()
    dates?: string[];

    @IsOptional()
    @IsString()
    startTimeAt?: string;

    @IsOptional()
    @IsString()
    endTimeAt?: string;
}
