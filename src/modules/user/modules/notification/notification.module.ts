import { Module } from '@nestjs/common';
import { UserNotificationController } from './notification.controller';
import { UserNotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '@/entity';

@Module({
    controllers: [UserNotificationController],
    providers: [UserNotificationService],
    imports: [TypeOrmModule.forFeature([NotificationEntity])],
})
export class UserNotificationModule {}
