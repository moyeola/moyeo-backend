import { CommonConstant } from '@/entity/constant/common.constant';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchUserMeReqDto {
    @IsOptional()
    @IsString()
    @MaxLength(
        CommonConstant.USER_NAME_PREFIX_MAX_LENGTH +
            CommonConstant.USER_NAME_MAX_LENGTH,
    )
    name?: string;

    @IsOptional()
    @IsString()
    profileImageUrl?: string;
}
