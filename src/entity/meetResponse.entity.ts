import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { MeetEntity } from './meet.entity';
import { UserEntity } from './user.entity';
import { MemberEntity } from './member.entity';

@Entity('meetResponse')
export class MeetResponseEntity extends BaseEntity {
  @Column()
  responserType: 'user' | 'member' | 'guest';

  @ManyToOne(() => UserEntity)
  responserUser?: UserEntity;

  @ManyToOne(() => MemberEntity)
  responserMember?: MemberEntity;

  @Column({
    nullable: true,
  })
  guestName?: string;

  @Column({
    nullable: true,
  })
  guestEmail?: string;

  @ManyToOne(() => MeetEntity, (meet) => meet.responses)
  meet: MeetEntity;

  @Column({
    type: 'text',
  })
  times: string;

  static create(data: {
    meet: MeetEntity;
    responser:
      | {
          type: 'user';
          user: UserEntity;
        }
      | {
          type: 'member';
          member: MemberEntity;
        }
      | {
          type: 'guest';
          guest: {
            name: string;
            email: string;
          };
        };
    times: {
      start: string;
      end: string;
    }[];
  }): MeetResponseEntity {
    const meetResponse = new MeetResponseEntity();

    meetResponse.meet = data.meet;
    meetResponse.responserType = data.responser.type;
    if (data.responser.type === 'user') {
      meetResponse.responserUser = data.responser.user;
    } else if (data.responser.type === 'member') {
      meetResponse.responserMember = data.responser.member;
    } else if (data.responser.type === 'guest') {
      meetResponse.guestName = data.responser.guest.name;
      meetResponse.guestEmail = data.responser.guest.email;
    }

    meetResponse.times = JSON.stringify(data.times);

    return meetResponse;
  }
}
