import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { NotificationAction } from 'moyeo-object';
import { UserEntity } from './user.entity';

export enum NotificationTypeEnum {
    'GROUP_SCHEDULE' = 'GROUP_SCHEDULE',
    'MEET_REQUEST' = 'MEET_REQUEST',
    'MOYEO_NOTICE' = 'MOYEO_NOTICE',
}

export enum NotificationAuthorTypeEnum {
    'GROUP' = 'GROUP',
    'MOYEO' = 'MOYEO',
}

@Entity('notification')
export class NotificationEntity extends BaseEntity {
    @Column()
    title: string;

    @Column()
    body: string;

    @Column({
        type: 'enum',
        enum: NotificationTypeEnum,
    })
    type: NotificationTypeEnum;

    @Column({
        type: 'enum',
        enum: NotificationAuthorTypeEnum,
    })
    authorType: NotificationAuthorTypeEnum;

    @Column({
        nullable: true,
        type: 'int',
    })
    authorId?: number;

    @Column()
    authorName: string;

    @Column({
        nullable: true,
        type: 'text',
    })
    action?: string;

    get parsedAction(): NotificationAction {
        return JSON.parse(this.action);
    }

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    static create(data: {
        title: string;
        body: string;
        type: NotificationTypeEnum;
        authorType: NotificationAuthorTypeEnum;
        authorId?: number;
        authorName: string;
        action?: NotificationAction;
    }): NotificationEntity {
        const notification = new NotificationEntity();
        notification.title = data.title;
        notification.body = data.body;
        notification.type = data.type;
        notification.authorType = data.authorType;
        notification.authorId = data.authorId;
        notification.authorName = data.authorName;
        notification.action = JSON.stringify(data.action);

        return notification;
    }
}
