import {
    CalendarEntity,
    GroupEntity,
    MemberEntity,
    UserEntity,
} from '@/entity';
import { CalendarObject } from '@/object/calendar.object';
import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(CalendarEntity)
        private readonly calendarRepository: Repository<CalendarEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,
    ) {}

    async createCalendar(data: {
        name?: string;
        owner:
            | {
                  type: 'group';
                  group: GroupEntity;
              }
            | {
                  type: 'user';
                  user: UserEntity;
              };
    }) {
        const calendar = CalendarEntity.create({
            name: data.name,
            owner: data.owner,
        });
        return this.calendarRepository.save(calendar);
    }

    async getCalendarById(id: number): Promise<CalendarEntity> {
        return this.calendarRepository.findOne({
            where: { id },
            relations: ['group', 'user'],
        });
    }

    async getCalendarsByOwner(
        owner: {
            type: 'user' | 'group';
            ownerId: number;
        },
        userId: number,
    ): Promise<CalendarEntity[]> {
        if (owner.type === 'group') {
            const member = await this.memberRepository.findOne({
                where: {
                    user: {
                        id: userId,
                    },
                    group: {
                        id: owner.ownerId,
                    },
                },
                relations: [],
            });

            if (!member) {
                throw new ForbiddenException({
                    code: 'forbidden',
                });
            }
        }

        if (owner.type === 'user' && owner.ownerId !== userId) {
            throw new ForbiddenException({
                code: 'forbidden',
            });
        }

        return this.calendarRepository.find({
            where: {
                ownerType: owner.type,
                group:
                    owner.type === 'group' ? { id: owner.ownerId } : undefined,
                user: owner.type === 'user' ? { id: owner.ownerId } : undefined,
            },
            relations: ['group', 'user'],
        });
    }

    async patchCalendar(
        calendarId: number,
        data: {
            name?: string;
        },
    ) {
        let calendar = await this.calendarRepository.findOne({
            where: {
                id: calendarId,
            },
            relations: ['group', 'user'],
        });

        if (!calendar) {
            throw new NotFoundException({
                code: 'calendar_not_found',
            });
        }

        await this.calendarRepository.update(
            {
                id: calendarId,
            },
            {
                name: data.name,
            },
        );

        calendar = await this.calendarRepository.findOne({
            where: {
                id: calendarId,
            },
            relations: ['group', 'user'],
        });
        return CalendarObject.from(calendar);
    }

    async getCalendarsByUserId(userId: number): Promise<CalendarObject[]> {
        const calendars = await this.calendarRepository
            .createQueryBuilder('calendar')
            .leftJoinAndSelect('calendar.group', 'group')
            .leftJoinAndSelect('group.members', 'member')
            .where('member.userId = :userId', { userId })
            .getMany();

        return calendars.map((calendar) => CalendarObject.from(calendar));
    }

    async validateUserMemberOfCalendar(
        calendarId: number,
        userId: number,
    ): Promise<boolean> {
        const calendar = await this.calendarRepository.findOne({
            where: {
                id: calendarId,
            },
            relations: ['group'],
        });

        if (!calendar) {
            throw new NotFoundException({
                code: 'calendar_not_found',
            });
        }

        if (calendar.ownerType !== 'group') {
            throw new ForbiddenException({
                code: 'forbidden',
            });
        }

        const member = await this.memberRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
                group: {
                    id: calendar?.group?.id,
                },
            },
        });

        if (!member) {
            throw new ForbiddenException({
                code: 'forbidden',
            });
        }

        return true;
    }
}
