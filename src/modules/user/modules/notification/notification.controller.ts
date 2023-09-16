import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UserNotificationService } from './notification.service';
import { Auth } from '@/modules/auth/decorator/auth.decorator';
import { Token } from '@/modules/auth/decorator/token.decorator';
import { AccessTokenPayload } from '@/modules/auth/types/accessTokenPayload';
import {
    DeleteUserMeNotificationRes,
    GetUserMeNotificationsRes,
} from 'moyeo-object';
import { GetUserMeNotificationsReqDto } from './dto/GetUserMeNotification.req.dto';

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
        return {
            notifications,
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
}
