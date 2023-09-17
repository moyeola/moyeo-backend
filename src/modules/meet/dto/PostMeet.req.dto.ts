import { CommonConstant } from '@/entity/constant/common.constant';
import {
    IsArray,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class PostMeetReqDto {
    @IsString()
    @MaxLength(CommonConstant.MEET_TITLE_MAX_LENGTH)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(CommonConstant.MEET_DESCRIPTION_MAX_LENGTH)
    description?: string;

    @IsArray()
    dates: string[];

    @IsString()
    startTimeAt: string;

    @IsString()
    endTimeAt: string;

    @IsObject()
    creator:
        | {
              type: 'user';
          }
        | {
              type: 'member';
              memberId: number;
          };
}
