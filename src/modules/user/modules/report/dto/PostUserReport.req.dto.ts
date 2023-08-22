import { ReportReasonEnum } from '@/entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostUserReportReqDto {
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsEnum(ReportReasonEnum)
    reason?: ReportReasonEnum;

    @IsOptional()
    @IsString()
    description?: string;
}
