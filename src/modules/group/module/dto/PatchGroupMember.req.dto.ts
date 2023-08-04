import { IsOptional, IsString } from 'class-validator';

export class PatchGroupMemberReqDto {
  @IsString()
  @IsOptional()
  nickname?: string;
}
