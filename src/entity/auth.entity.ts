import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { UserEntity } from './user.entity';

export enum AuthType {
    'oAuth' = 'oAuth',
}

@Entity('auth')
export class AuthEntity extends BaseEntity {
    @Column({
        type: 'enum',
        default: AuthType.oAuth,
        enum: AuthType,
    })
    type: AuthType;

    @Column()
    oAuth: 'google';

    @Column()
    oAuthId: string;

    @Column()
    oAuthEmail: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    static create({
        oAuth,
        oAuthId,
        oAuthEmail,
        user,
    }: {
        oAuth: 'google';
        oAuthId: string;
        oAuthAccessToken: string;
        oAuthRefreshToken: string;
        oAuthEmail: string;
        user: UserEntity;
    }) {
        const auth = new AuthEntity();
        auth.oAuth = oAuth;
        auth.oAuthId = oAuthId;
        auth.oAuthEmail = oAuthEmail;
        auth.user = user;
        return auth;
    }
}
