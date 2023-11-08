import { Module } from '@nestjs/common';
import { UserNotificationController } from './notification.controller';
import { UserNotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity, UserEntity } from '@/entity';
import { NotificationDeviceEntity } from '@/entity/notificationDevice.entity';

@Module({
    controllers: [UserNotificationController],
    providers: [UserNotificationService],
    imports: [
        TypeOrmModule.forFeature([
            NotificationEntity,
            NotificationDeviceEntity,
            UserEntity,
        ]),
    ],
})
export class UserNotificationModule {}
