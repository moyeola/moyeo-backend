import { CalendarDto, GroupDto, UserDto } from 'moyeo-object';
import { GroupObject } from './group.object';
import { CalendarEntity } from '@/entity';

export class CalendarObject implements CalendarDto {
    id: number;
    createdAt: string;
    updatedAt: string;

    owner:
        | { type: 'user'; user?: UserDto }
        | { type: 'group'; group?: GroupDto };

    static from(calendar: CalendarEntity): CalendarObject {
        const calendarObject = new CalendarObject();

        calendarObject.id = calendar.id;
        calendarObject.createdAt = calendar.createdAt.toISOString();
        calendarObject.updatedAt = calendar.updatedAt.toISOString();

        if ('group' in calendar.group) {
            calendarObject.owner = {
                type: 'group',
                group: GroupObject.from(calendar.group),
            };
        }

        return calendarObject;
    }
}
