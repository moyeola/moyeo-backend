import { NotificationEntity } from '@/entity';
import {
    NotificationAction,
    NotificationAuthor,
    NotificationDto,
    NotificationType,
} from 'moyeo-object';

export class NotificationObject implements NotificationDto {
    id: number;
    title: string;
    body: string;
    author: NotificationAuthor;
    type: NotificationType;
    action: NotificationAction;
    createdAt: string;

    static from(notification: NotificationEntity): NotificationObject {
        const notificationObject = new NotificationObject();

        notificationObject.id = notification.id;
        notificationObject.title = notification.title;
        notificationObject.body = notification.body;
        notificationObject.author = {
            type: notification.authorType,
            id: notification.authorId,
            name: notification.authorName,
        };
        notificationObject.type = notification.type;
        notificationObject.action = notification.parsedAction;
        notificationObject.createdAt = notification.createdAt.toISOString();

        return notificationObject;
    }
}
