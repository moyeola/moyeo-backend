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
        });
    }

    async patchCalendar(
        calendarId: number,
        data: {
            name?: string;
        },
    ) {
        const calendar = await this.calendarRepository.findOne({
            where: {
                id: calendarId,
            },
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
    }

    async getCalendarsByUserId(userId: number): Promise<CalendarObject[]> {
        const calendars = await this.calendarRepository
            .createQueryBuilder('calendar')
            .leftJoin('calendar.group', 'group')
            .leftJoin('group.members', 'member')
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

        const member = await this.memberRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
                group: {
                    id: calendar.ownerGroup.id,
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
