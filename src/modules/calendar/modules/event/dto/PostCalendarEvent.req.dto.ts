import { CommonConstant } from '@/entity/constant/common.constant';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class PostCalendarEventReqDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(CommonConstant.CALENDAR_EVENT_TITLE_MAX_LENGTH)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(CommonConstant.CALENDAR_EVENT_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(CommonConstant.CALENDAR_EVENT_LOCATION_MAX_LENGTH)
  location?: string;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @IsObject()
  start: {
    date?: string;
    dateTime?: string;
  };

  @IsOptional()
  @IsObject()
  end?: {
    date?: string;
    dateTime?;
    string;
  };
}
