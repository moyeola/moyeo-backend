import { NotificationEntity } from '@/entity';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationService {
    async send(notification: NotificationEntity, tokens: string[]) {
        const action = `${notification.parsedAction.type}:${notification.parsedAction.url}`;

        await axios.post(
            'https://fcm.googleapis.com/fcm/send',
            {
                registration_ids: tokens,
                notification: {
                    title: notification.title,
                    body: notification.body,
                    action: action,
                },
            },
            {
                headers: {
                    Authorization: `key=${process.env.VAPID_PRIVATE_KEY}`,
                },
            },
        );
    }
}
