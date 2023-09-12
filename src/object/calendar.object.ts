import { CalendarDto, GroupDto, UserDto } from 'moyeo-object';
import { GroupObject } from './group.object';
import { CalendarEntity } from '@/entity';
import { UserObject } from './user.object';

export class CalendarObject implements CalendarDto {
    id: number;
    name: string;
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

        if (calendar.ownerType === 'group') {
            calendarObject.owner = {
                type: 'group',
                group: GroupObject.from(calendar.ownerGroup),
            };
        } else if (calendar.ownerType === 'user') {
            calendarObject.owner = {
                type: 'user',
                user: UserObject.from(calendar.ownerUser),
            };
        }

        return calendarObject;
    }
}
