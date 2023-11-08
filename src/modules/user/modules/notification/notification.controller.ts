import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { UserNotificationService } from './notification.service';
import { Auth } from '@/modules/auth/decorator/auth.decorator';
import { Token } from '@/modules/auth/decorator/token.decorator';
import { AccessTokenPayload } from '@/modules/auth/types/accessTokenPayload';
import {
    DeleteUserMeNotificationRes,
    GetUserMeNotificationsRes,
    PostUserMeNotificationRegisterRes,
} from 'moyeo-object';
import { GetUserMeNotificationsReqDto } from './dto/GetUserMeNotification.req.dto';
import { PostUserMeNotificationRegisterReqDto } from './dto/PostUserMeNotificationRegister.req.dto';
import { NotificationObject } from '@/object';

@Auth()
@Controller('users/me/notifications')
export class UserNotificationController {
    constructor(
        private readonly userNotificationService: UserNotificationService,
    ) {}

    @Get()
    async getNotifications(
        @Token() token: AccessTokenPayload,
        @Query() query?: GetUserMeNotificationsReqDto,
    ): Promise<GetUserMeNotificationsRes> {
        const userId = token.userId;
        const { limit = 100, page = 1 } = query;
        const notifications =
            await this.userNotificationService.getNotifications(
                userId,
                page,
                limit,
            );

        const notificationObjs = notifications.map((notification) =>
            NotificationObject.from(notification),
        );
        return {
            notifications: notificationObjs,
        };
    }

    @Delete(':notificationId')
    async deleteNotification(
        @Token() token: AccessTokenPayload,
        @Param('notificationId') notificationId: string,
    ): Promise<DeleteUserMeNotificationRes> {
        const userId = token.userId;
        await this.userNotificationService.deleteUserMeNotification(
            userId,
            +notificationId,
        );
        return;
    }

    @Post('/register')
    async registerNotificationDevice(
        @Token() token: AccessTokenPayload,
        @Body() dto: PostUserMeNotificationRegisterReqDto,
    ): Promise<PostUserMeNotificationRegisterRes> {
        await this.userNotificationService.registerNotificationDevice(
            token.userId,
            dto.token,
        );
        return;
    }
}
