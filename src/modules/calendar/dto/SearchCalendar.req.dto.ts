import { IsString } from 'class-validator';

export class SearchCalendarReqDto {
    @IsString()
    ownerType: 'group' | 'user';

    @IsString()
    ownerId: string;
}
