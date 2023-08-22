import { CalendarEntity, GroupEntity, MemberEntity } from '@/entity';
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

    async createCalendar(group: GroupEntity) {
        const calendar = CalendarEntity.create(group);
        return this.calendarRepository.save(calendar);
    }

    async getCalendarById(id: number): Promise<CalendarEntity> {
        return this.calendarRepository.findOne({
            where: { id },
        });
    }

    async patchCalendar(calendarId: number, data: any) {
        // TODO: 추후 Calendar에 수정 가능한 요소가 생기면 활용
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
            {},
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
                    id: calendar.group.id,
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
