import { CalendarEventEntity } from '@/entity';
import { CalendarEventDto } from 'moyeo-object';

export class CalendarEventObject implements CalendarEventDto {
    id: number;
    calendarId: number;
    creatorId: number;

    title: string;
    description?: string;
    location?: string;
    isOnline: boolean;

    start: {
        date?: string;
        dateTime?: string;
    };

    end: {
        date?: string;
        dateTime?: string;
    };

    createdAt: string;
    updatedAt: string;

    static from(calendarEvent: CalendarEventEntity): CalendarEventObject {
        const calendarEventObject = new CalendarEventObject();

        calendarEventObject.id = calendarEvent.id;
        calendarEventObject.calendarId = calendarEvent.calendarId;
        calendarEventObject.creatorId = calendarEvent.creatorId;

        calendarEventObject.title = calendarEvent.title;
        calendarEventObject.description = calendarEvent.description;
        calendarEventObject.location = calendarEvent.location;
        calendarEventObject.isOnline = calendarEvent.isOnline;

        calendarEventObject.start = {
            date: calendarEvent?.startDate,
            dateTime: calendarEvent?.startTime,
        };

        calendarEventObject.end = {
            date: calendarEvent?.endDate,
            dateTime: calendarEvent?.endTime,
        };

        calendarEventObject.createdAt = new Date(
            calendarEvent.createdAt,
        ).toISOString();
        calendarEventObject.updatedAt = new Date(
            calendarEvent.updatedAt,
        ).toISOString();

        return calendarEventObject;
    }
}
