import { NotificationEntity } from '@/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserNotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepository: Repository<NotificationEntity>,
    ) {}

    async getNotifications(userId: number, page: number, limit: number) {
        const notifications = await this.notificationRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
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
}
