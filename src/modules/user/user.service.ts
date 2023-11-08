import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity, UserEntity } from '@/entity';
import { UserObject } from '@/object';
import { Repository } from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { GetUserMeRes } from 'moyeo-object';
import { Embed, Webhook } from '@hyunsdev/discord-webhook';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(AuthEntity)
        private readonly authRepository: Repository<AuthEntity>,
        private readonly calendarService: CalendarService,
    ) {}

    async getUser(userId: number): Promise<GetUserMeRes['user']> {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: ['permissions', 'members', 'members.group'],
        });

        if (!user)
            throw new NotFoundException({
                code: 'user_not_found',
            });

        return UserObject.from(user) as GetUserMeRes['user'];
    }

    async createUser(
        data: Parameters<typeof UserEntity.create>[0],
    ): Promise<UserEntity> {
        let user = UserEntity.create(data);

        // 개인 캘린더 생성
        await this.calendarService.createCalendar({
            name: user.name,
            owner: {
                type: 'user',
                user,
            },
        });

        user = await this.userRepository.save(user);

        const client = new Webhook(
            process.env.DISCORD_WEBHOOK_NEW,
            'Moyeo 봇',
            'https://moyeo.la/moyeo.png',
        );

        const embed: Embed = new Embed({
            title: '새로운 사용자가 가입했어요!',
            fields: [
                {
                    name: 'User',
                    value: `[ ${user.id} ] ${user.name}(${user.email})`,
                },
            ],
            thumbnail: {
                url: user.profileImageUrl,
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: `moyoe.la`,
                icon_url: 'https://moyeo.la/moyeo.png',
            },
            color: 0x03fc6f,
        });
        await client.send('', [embed]);

        return user;
    }

    async patchUser(
        userId: number,
        data: {
            name?: string;
            profileImageUrl?: string;
        },
    ) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException({
                code: 'user_not_found',
            });
        }

        await this.userRepository.update(
            {
                id: userId,
            },
            data,
        );
    }

    async deleteUser(userId: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException({
                code: 'user_not_found',
            });
        }

        await this.userRepository.update(
            {
                id: userId,
            },
            {
                name: '탈퇴한 사용자',
                profileImageUrl: '',
                email: '',
            },
        );

        await this.authRepository.softDelete({
            user,
        });

        await this.userRepository.softDelete({
            id: userId,
        });
    }
}
