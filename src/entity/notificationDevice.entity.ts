import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { UserEntity } from './user.entity';

@Entity('notificationDevice')
export class NotificationDeviceEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, (user) => user.notificationDevices)
    user: UserEntity;

    @Column()
    token: string;

    static create({
        token,
        user,
    }: {
        token: string;
        user: UserEntity;
    }): NotificationDeviceEntity {
        const notificationDevice = new NotificationDeviceEntity();
        notificationDevice.token = token;
        notificationDevice.user = user;
        return notificationDevice;
    }
}
