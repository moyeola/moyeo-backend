import { IsNumber, IsOptional } from 'class-validator';

export class GetUserMeNotificationsReqDto {
    @IsOptional()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsNumber()
    page?: number;
}
