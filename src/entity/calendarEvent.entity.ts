import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { CalendarEntity } from './calendar.entity';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { CommonConstant } from './constant/common.constant';
import { MemberEntity } from './member.entity';

@Entity('calendarEvent')
export class CalendarEventEntity extends BaseEntity {
    @ManyToOne(() => CalendarEntity, (calendar) => calendar.events)
    @JoinColumn()
    calendar: CalendarEntity;

    @Column()
    @IsNotEmpty()
    calendarId: number;

    @ManyToOne(() => MemberEntity)
    @JoinColumn()
    creator: MemberEntity;

    @Column()
    @IsNotEmpty()
    creatorId: number;

    @Column()
    @IsNotEmpty()
    @MaxLength(CommonConstant.CALENDAR_EVENT_TITLE_MAX_LENGTH)
    title: string;

    @Column({
        nullable: true,
    })
    @MaxLength(CommonConstant.CALENDAR_EVENT_DESCRIPTION_MAX_LENGTH)
    description?: string;

    @Column({
        nullable: true,
    })
    @MaxLength(CommonConstant.CALENDAR_EVENT_LOCATION_MAX_LENGTH)
    location?: string;

    @Column({
        type: 'boolean',
        default: false,
    })
    isOnline: boolean;

    @Column({
        nullable: true,
    })
    startDate?: string;

    @Column({
        nullable: true,
    })
    endDate?: string;

    @Column({
        nullable: true,
    })
    startTime?: string;

    @Column({
        nullable: true,
    })
    endTime?: string;

    static create(data: {
        calendar: CalendarEntity;
        creator: MemberEntity;
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
    }): CalendarEventEntity {
        const calendarEvent = new CalendarEventEntity();
        calendarEvent.calendar = data.calendar;
        calendarEvent.creator = data.creator;
        calendarEvent.title = data.title;
        calendarEvent.description = data.description;
        calendarEvent.location = data.location;
        calendarEvent.isOnline = data.isOnline || false;

        calendarEvent.startDate = data.start?.date;
        calendarEvent.endDate = data?.end?.date;
        calendarEvent.startTime = data.start?.dateTime;
        calendarEvent.endTime = data?.end?.dateTime;

        return calendarEvent;
    }
}
