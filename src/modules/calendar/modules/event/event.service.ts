import { CalendarEntity, CalendarEventEntity, MemberEntity } from '@/entity';
import { CalendarEventObject } from '@/object/calendarEvent.object';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CalendarEventService {
    constructor(
        @InjectRepository(CalendarEntity)
        private readonly calendarRepository: Repository<CalendarEntity>,
        @InjectRepository(CalendarEventEntity)
        private readonly calendarEventRepository: Repository<CalendarEventEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,
    ) {}

    async getCalendarEventsByCalendarId(
        calendarId: number,
    ): Promise<CalendarEventObject[]> {
        const events = await this.calendarEventRepository.find({
            where: {
                calendar: {
                    id: calendarId,
                },
            },
        });

        return events.map((event) => CalendarEventObject.from(event));
    }

    async getCalendarEventById(
        id: number,
        calendarId: number,
    ): Promise<CalendarEventEntity> {
        return this.calendarEventRepository.findOne({
            where: {
                id,
                calendar: {
                    id: calendarId,
                },
            },
        });
    }

    async createCalendarEvent(
        calendarId: number,
        userId: number,
        data: {
            title: string;
            description?: string;
            location?: string;
            isOnline?: boolean;
            start: {
                date?: string;
                dateTime?: string;
            };
            end?: {
                date?: string;
                dateTime?: string;
            };
        },
    ): Promise<CalendarEventEntity> {
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

        // 날짜 유효성 체크
        this.validateEventDateTime(data.start, data.end);

        const calendarEvent = CalendarEventEntity.create({
            calendar,
            creator: member,
            title: data.title,
            description: data.description,
            location: data.location,
            isOnline: data.isOnline,
            start: {
                date: data.start?.date,
                dateTime: data.start?.dateTime,
            },
            end: {
                date: data.end?.date,
                dateTime: data.end?.dateTime,
            },
        });

        return this.calendarEventRepository.save(calendarEvent);
    }

    async patchCalendarEvent(
        id: number,
        calendarId: number,
        data: {
            title?: string;
            description?: string;
            location?: string;
            isOnline?: boolean;
            start?: {
                date?: string;
                dateTime?: string;
            };
            end?: {
                date?: string;
                dateTime?: string;
            };
        },
    ) {
        const calendarEvent = await this.calendarEventRepository.findOne({
            where: {
                id,
                calendar: {
                    id: calendarId,
                },
            },
        });

        if (!calendarEvent) {
            throw new NotFoundException({
                code: 'calendar_event_not_found',
            });
        }

        // 날짜 유효성 체크
        this.validateEventDateTime(data.start, data.end);

        await this.calendarEventRepository.update(
            {
                id,
            },
            {
                title: data.title,
                description: data.description,
                location: data.location,
                isOnline: data.isOnline,
                startDate: data.start?.date,
                startTime: data.start?.dateTime,
                endDate: data.end?.date,
                endTime: data.end?.dateTime,
            },
        );

        return await this.calendarEventRepository.findOne({
            where: {
                id,
                calendar: {
                    id: calendarId,
                },
            },
        });
    }

    async deleteCalendarEvent(id: number, calendarId: number) {
        const calendarEvent = await this.calendarEventRepository.findOne({
            where: {
                id,
                calendar: {
                    id: calendarId,
                },
            },
        });

        if (!calendarEvent) {
            throw new NotFoundException({
                code: 'calendar_event_not_found',
            });
        }

        await this.calendarEventRepository.delete({
            id,
        });
    }

    private validateEventDateTime(
        start: {
            date?: string;
            dateTime?: string;
        },
        end?: {
            date?: string;
            dateTime?: string;
        },
    ) {
        if ((start.date && start.dateTime) || (end.date && end.dateTime)) {
            throw new BadRequestException({
                code: 'invalid_date',
                message: 'date와 dateTime은 동시에 존재할 수 없습니다.',
            });
        }

        if ((start.date && end.dateTime) || (end.date && start.dateTime)) {
            throw new BadRequestException({
                code: 'invalid_date',
                message: 'date와 dateTime은 동시에 존재할 수 없습니다.',
            });
        }

        if (start.date && end.date) {
            if (new Date(start.date) > new Date(end.date)) {
                throw new BadRequestException({
                    code: 'invalid_date',
                    message: '시작 날짜가 종료 날짜보다 늦을 수 없습니다.',
                });
            }
        }

        if (start.dateTime && end.dateTime) {
            if (new Date(start.dateTime) > new Date(end.dateTime)) {
                throw new BadRequestException({
                    code: 'invalid_date',
                    message: '시작 날짜가 종료 날짜보다 늦을 수 없습니다.',
                });
            }
        }
    }
}
