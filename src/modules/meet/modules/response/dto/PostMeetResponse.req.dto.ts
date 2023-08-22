import { IsArray, IsObject } from 'class-validator';

export class PostMeetResponseReqDto {
    @IsObject()
    responser:
        | {
              type: 'user';
          }
        | {
              type: 'member';
              memberId: number;
          }
        | {
              type: 'guest';
              guest: {
                  name: string;
                  email: string;
              };
          };

    @IsArray()
    times: {
        start: string;
        end: string;
    }[];
}
