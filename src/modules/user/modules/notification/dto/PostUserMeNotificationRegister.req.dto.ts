import { IsString } from 'class-validator';

export class PostUserMeNotificationRegisterReqDto {
    @IsString()
    token: string;
}
