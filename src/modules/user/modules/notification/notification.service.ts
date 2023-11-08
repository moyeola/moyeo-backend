import { NotificationEntity, UserEntity } from '@/entity';
import { NotificationDeviceEntity } from '@/entity/notificationDevice.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserNotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepository: Repository<NotificationEntity>,
        @InjectRepository(NotificationDeviceEntity)
        private readonly notificationDeviceRepository: Repository<NotificationDeviceEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getNotifications(userId: number, page: number, limit: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: ['members', 'members.group'],
        });

        const notifications = await this.notificationRepository.find({
            where: [],
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return notifications;
    }

    async deleteUserMeNotification(userId: number, notificationId: number) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id: notificationId,
                user: {
                    id: userId,
                },
            },
        });

        if (!notification) return;

        await this.notificationRepository.delete(notification);
    }

    async registerNotificationDevice(
        userId: number,
        token: string,
    ): Promise<NotificationDeviceEntity> {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        const notificationDevice = NotificationDeviceEntity.create({
            token,
            user,
        });
        return await this.notificationDeviceRepository.save(notificationDevice);
    }
}
