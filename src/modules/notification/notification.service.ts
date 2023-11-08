import { NotificationEntity, UserEntity } from '@/entity';
import { NotificationDeviceEntity } from '@/entity/notificationDevice.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { google } from 'googleapis';
import { Not, Repository } from 'typeorm';

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        const key = JSON.parse(process.env.FIREBASE_ACCOUNT_JSON);
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null,
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepository: Repository<NotificationEntity>,
        @InjectRepository(NotificationDeviceEntity)
        private readonly notificationDeviceRepository: Repository<NotificationDeviceEntity>,
    ) {}

    async getTokensByGroupId(groupId: number, withoutUserId?: number) {
        const devices = await this.notificationDeviceRepository.find({
            where: {
                user: {
                    id: withoutUserId ? Not(withoutUserId) : undefined,
                    members: {
                        group: {
                            id: groupId,
                        },
                    },
                },
            },
        });
        return devices.map((device) => device.token);
    }

    async send(notification: NotificationEntity, users: UserEntity[]) {
        const action = `${notification.parsedAction.type}:${notification.parsedAction.url}`;

        const accessToken = await getAccessToken();

        for (const user of users) {
            const tokens = user.notificationDevices.map(
                (device) => device.token,
            );

            for (const token of tokens) {
                try {
                    await axios.post(
                        `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`,
                        {
                            message: {
                                token: token,
                                notification: {
                                    title: notification.title,
                                    body: notification.body,
                                },
                                data: {
                                    action: action,
                                    icon: 'https://moyeo.la/moyeo.png',
                                },
                                webpush: {
                                    headers: {
                                        Urgency: 'high',
                                    },
                                    notification: {
                                        title: notification.title,
                                        body: notification.body,
                                        requireInteraction: 'true',
                                        icon: 'https://moyeo.la/moyeo.png',
                                        action: action,
                                        data: {
                                            action: action,
                                        },
                                    },
                                },
                            },
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                } catch (error) {
                    if (error.response.status === 404) continue;
                    throw error;
                }
            }

            await this.notificationRepository.save({
                ...notification,
                user,
            });
        }
    }
}
