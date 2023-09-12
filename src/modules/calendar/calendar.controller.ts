import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Auth } from '../auth/decorator/auth.decorator';
import { CalendarService } from './calendar.service';
import { AccessTokenPayload } from '../auth/types/accessTokenPayload';
import { Token } from '../auth/decorator/token.decorator';
import { GetCalendarRes, GetCalendarsRes } from 'moyeo-object';
import { PatchCalendarReqDto } from './dto/PatchCalendar.req.dto';
import { SearchCalendarReqDto } from './dto/SearchCalendar.req.dto';
import { CalendarObject } from '../../object/calendar.object';

@Auth()
@Controller('calendars')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    @Get('/')
    async getCalendarsByUserId(
        @Token() token: AccessTokenPayload,
    ): Promise<GetCalendarsRes> {
        const calendars = await this.calendarService.getCalendarsByUserId(
            token.userId,
        );
        return {
            calendars,
        };
    }

    @Get('/search')
    async searchCalendars(
        @Token() token: AccessTokenPayload,
        @Query() dto: SearchCalendarReqDto,
    ) {
        const calendars = await this.calendarService.getCalendarsByOwner(
            {
                type: dto.ownerType,
                ownerId: parseInt(dto.ownerId),
            },
            token.userId,
        );
        return {
            calendars: calendars.map((calendar) =>
                CalendarObject.from(calendar),
            ),
        };
    }

    @Get('/:calendarId')
    async getCalendar(
        @Param('calendarId') calendarId: string,
        @Token() token: AccessTokenPayload,
    ): Promise<GetCalendarRes> {
        await this.calendarService.validateUserMemberOfCalendar(
            +calendarId,
            token.userId,
        );
        const calendar = await this.calendarService.getCalendarById(
            +calendarId,
        );
        return {
            calendar,
        };
    }

    @Patch('/:calendarId')
    async patchCalendar(
        @Param('calendarId') calendarId: string,
        @Token() token: AccessTokenPayload,
        @Body() dto: PatchCalendarReqDto,
    ) {
        await this.calendarService.validateUserMemberOfCalendar(
            +calendarId,
            token.userId,
        );
        await this.calendarService.patchCalendar(+calendarId, dto);
    }
}
