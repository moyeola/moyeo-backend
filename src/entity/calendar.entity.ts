import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { GroupEntity } from './group.entity';
import { CalendarEventEntity } from './calendarEvent.entity';

@Entity('calendar')
export class CalendarEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity)
  group: GroupEntity;

  @OneToMany(
    () => CalendarEventEntity,
    (calendarEvent) => calendarEvent.calendar,
  )
  events: CalendarEventEntity[];

  static create(group: GroupEntity): CalendarEntity {
    const calendar = new CalendarEntity();
    calendar.group = group;

    return calendar;
  }
}
