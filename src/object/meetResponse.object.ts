import { MeetResponseDto } from 'moyeo-object';
import { MeetObject } from './meet.object';
import { UserObject } from './user.object';
import { MemberObject } from './member.object';
import { MeetResponseEntity } from '@/entity/meetResponse.entity';

export class MeetResponseObject implements MeetResponseDto {
  id: number;
  meet?: MeetObject;
  createdAt: string;
  responser:
    | {
        type: 'user';
        user?: UserObject;
      }
    | {
        type: 'member';
        member?: MemberObject;
      }
    | {
        type: 'guest';
        guest?: {
          name: string;
          email: string;
        };
      };
  times: {
    start: string;
    end: string;
  };

  static from(meetResponse: MeetResponseEntity): MeetResponseObject {
    const meetResponseObject = new MeetResponseObject();

    meetResponseObject.id = meetResponse.id;
    meetResponseObject.createdAt = meetResponse.createdAt.toISOString();
    meetResponseObject.times = JSON.parse(meetResponse.times);

    if (meetResponse.responserType === 'user') {
      meetResponseObject.responser = {
        type: 'user',
        user: UserObject.from(meetResponse.responserUser),
      };
    } else if (meetResponse.responserType === 'member') {
      meetResponseObject.responser = {
        type: 'member',
        member: MemberObject.from(meetResponse.responserMember),
      };
    } else if (meetResponse.responserType === 'guest') {
      meetResponseObject.responser = {
        type: 'guest',
        guest: {
          name: meetResponse.guestName,
          email: meetResponse.guestEmail,
        },
      };
    }

    return meetResponseObject;
  }
}
