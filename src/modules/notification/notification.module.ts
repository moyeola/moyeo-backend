import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '@/entity';
import { NotificationDeviceEntity } from '@/entity/notificationDevice.entity';

@Module({
    providers: [NotificationService],
    exports: [NotificationService],
    imports: [
        TypeOrmModule.forFeature([
            NotificationEntity,
            NotificationDeviceEntity,
        ]),
    ],
})
export class NotificationModule {}
