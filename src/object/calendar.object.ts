import { CalendarDto } from 'moyeo-object';
import { GroupObject } from './group.object';
import { CalendarEntity } from '@/entity';

export class CalendarObject implements CalendarDto {
  id: number;
  group: GroupObject;
  createdAt: string;
  updatedAt: string;

  static from(calendar: CalendarEntity): CalendarObject {
    const calendarObject = new CalendarObject();

    calendarObject.id = calendar.id;
    calendarObject.group = GroupObject.from(calendar.group);
    calendarObject.createdAt = calendar.createdAt.toISOString();
    calendarObject.updatedAt = calendar.updatedAt.toISOString();

    return calendarObject;
  }
}
