import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { GroupEntity } from './group.entity';
import { CalendarEventEntity } from './calendarEvent.entity';
import { UserEntity } from './user.entity';

@Entity('calendar')
export class CalendarEntity extends BaseEntity {
    @Column({
        nullable: true,
    })
    name?: string;

    @Column()
    ownerType: 'group' | 'user';

    @ManyToOne(() => UserEntity)
    user?: UserEntity;

    @ManyToOne(() => GroupEntity)
    group?: GroupEntity;

    @OneToMany(
        () => CalendarEventEntity,
        (calendarEvent) => calendarEvent.calendar,
    )
    events?: CalendarEventEntity[];

    static create(data: {
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
    }): CalendarEntity {
        const calendar = new CalendarEntity();
        calendar.name = data.name;
        calendar.ownerType = data.owner.type;
        if (data.owner.type === 'group') {
            calendar.group = data.owner.group;
        } else if (data.owner.type === 'user') {
            calendar.user = data.owner.user;
        }

        return calendar;
    }
}
