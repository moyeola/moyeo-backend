import { MeetDto } from 'moyeo-object';
import { MeetResponseObject } from './meetResponse.object';
import { UserObject } from './user.object';
import { MemberObject } from './member.object';
import { MeetEntity } from '@/entity/meet.entity';

export class MeetObject implements MeetDto {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  dates: string[];
  startTimeAt: string;
  endTimeAt: string;
  responses: MeetResponseObject[];
  creator:
    | {
        type: 'user';
        user?: UserObject;
      }
    | {
        type: 'member';
        member?: MemberObject;
      };

  static from(meet: MeetEntity): MeetObject {
    const meetObject = new MeetObject();

    meetObject.id = meet.id;
    meetObject.title = meet.title;
    meetObject.description = meet.description;
    meetObject.createdAt = meet.createdAt.toISOString();
    meetObject.updatedAt = meet.updatedAt.toISOString();
    meetObject.dates = JSON.parse(meet.dates);
    meetObject.startTimeAt = meet.startTimeAt;
    meetObject.endTimeAt = meet.endTimeAt;

    if (meet.creatorType === 'user') {
      meetObject.creator = {
        type: 'user',
        user: UserObject.from(meet.creatorUser),
      };
    } else if (meet.creatorType === 'member') {
      meetObject.creator = {
        type: 'member',
        member: MemberObject.from(meet.creatorMember),
      };
    }

    return meetObject;
  }
}
