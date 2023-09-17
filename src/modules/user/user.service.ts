import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity, UserEntity } from '@/entity';
import { UserObject } from '@/object';
import { Repository } from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { GetUserMeRes } from 'moyeo-object';

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
        const user = UserEntity.create(data);

        // 개인 캘린더 생성
        await this.calendarService.createCalendar({
            name: user.name,
            owner: {
                type: 'user',
                user,
            },
        });

        return await this.userRepository.save(user);
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
