import { CommonConstant } from '@/entity/constant/common.constant';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchGroupReqDto {
  @IsOptional()
  @IsString()
  @MaxLength(CommonConstant.GROUP_NAME_MAX_LENGTH)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(CommonConstant.GROUP_DESCRIPTION_MAX_LENGTH)
  description?: string;
}
