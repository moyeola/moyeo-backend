import { IsArray } from 'class-validator';

export class PatchMeetResponseReqDto {
    @IsArray()
    times: {
        start: string;
        end: string;
    }[];
}
