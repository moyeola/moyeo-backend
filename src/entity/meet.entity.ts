import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { CommonConstant } from './constant/common.constant';
import { UserEntity } from './user.entity';
import { MemberEntity } from './member.entity';
import { MeetResponseEntity } from './meetResponse.entity';

@Entity('meet')
export class MeetEntity extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @MaxLength(CommonConstant.MEET_TITLE_MAX_LENGTH)
  title: string;

  @Column({
    nullable: true,
  })
  @MaxLength(CommonConstant.MEET_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @Column()
  dates: string;

  @Column()
  startTimeAt: string;

  @Column()
  endTimeAt: string;

  @Column()
  creatorType: 'user' | 'member';

  @ManyToOne(() => UserEntity)
  creatorUser?: UserEntity;

  @ManyToOne(() => MemberEntity)
  creatorMember?: MemberEntity;

  @OneToMany(() => MeetResponseEntity, (meetResponse) => meetResponse.meet)
  responses: MeetResponseEntity[];

  static create(data: {
    title: string;
    description: string;
    dates: string[];
    startTimeAt: string;
    endTimeAt: string;
    creator:
      | {
          type: 'user';
          user: UserEntity;
        }
      | {
          type: 'member';
          member: MemberEntity;
        };
  }): MeetEntity {
    const meet = new MeetEntity();
    meet.title = data.title;
    meet.description = data.description;
    meet.dates = JSON.stringify(data.dates);
    meet.startTimeAt = data.startTimeAt;
    meet.endTimeAt = data.endTimeAt;
    meet.creatorType = data.creator.type;
    if (data.creator.type === 'user') {
      meet.creatorUser = data.creator.user;
    } else {
      meet.creatorMember = data.creator.member;
    }
    return meet;
  }
}
