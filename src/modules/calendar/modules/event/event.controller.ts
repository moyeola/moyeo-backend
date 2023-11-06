import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CalendarEventService } from './event.service';
import { Auth } from '@/modules/auth/decorator/auth.decorator';
import { AccessTokenPayload } from '@/modules/auth/types/accessTokenPayload';
import { Token } from '@/modules/auth/decorator/token.decorator';
import {
    DeleteCalendarEventRes,
    GetCalendarEventRes,
    GetCalendarEventsRes,
    PatchCalendarEventRes,
    PostCalendarEventRes,
} from 'moyeo-object';
import { PostCalendarEventReqDto } from './dto/PostCalendarEvent.req.dto';
import { CalendarService } from '../../calendar.service';
import { CalendarEventObject } from '@/object';

@Auth()
@Controller('calendars/:calendarId/events')
export class CalendarEventController {
    constructor(
        private readonly calendarEventService: CalendarEventService,
        private readonly calendarService: CalendarService,
    ) {}

    @Get('/')
    async getCalendarEventsByCalendarId(
        @Param('calendarId') calendarId: string,
        @Token() token: AccessTokenPayload,
    ): Promise<GetCalendarEventsRes> {
        await this.calendarService.validateUserMemberOfCalendar(
            +calendarId,
            token.userId,
        );
        const events =
            await this.calendarEventService.getCalendarEventsByCalendarId(
                +calendarId,
            );
        return {
            events,
        };
    }

    @Get('/:eventId')
    async getCalendarEventById(
        @Param('calendarId') calendarId: string,
        @Param('eventId') eventId: string,
        @Token() token: AccessTokenPayload,
    ): Promise<GetCalendarEventRes> {
        await this.calendarService.validateUserMemberOfCalendar(
            +calendarId,
            token.userId,
        );
        const event = await this.calendarEventService.getCalendarEventById(
            +eventId,
            +calendarId,
        );
        const eventObj = CalendarEventObject.from(event);
        return {
            event: eventObj,
        };
    }

    @Post('/')
    async createCalendarEvent(
        @Param('calendarId') calendarId: string,
        @Token() token: AccessTokenPayload,
        @Body() data: PostCalendarEventReqDto,
    ): Promise<PostCalendarEventRes> {
        await this.calendarService.validateUserMemberOfCalendar(
            +calendarId,
            token.userId,
        );
        const event = await this.calendarEventService.createCalendarEvent(
            +calendarId,
            token.userId,
            data,
        );
        const eventObj = CalendarEventObject.from(event);
        return {
            event: eventObj,
        };
    }

    @Patch('/:eventId')
    async patchCalendarEvent(
        @Param('calendarId') calendarId: string,
        @Param('eventId') eventId: string,
        @Token() token: AccessTokenPayload,
        @Body() data: PostCalendarEventReqDto,
    ): Promise<PatchCalendarEventRes> {
        await this.calendarService.validateUserMemberOfCalendar(
            +calendarId,
            token.userId,
        );
        const event = await this.calendarEventService.patchCalendarEvent(
            +eventId,
            +calendarId,
            data,
        );
        const eventObj = CalendarEventObject.from(event);
        return {
            event: eventObj,
        };
    }

    @Delete('/:eventId')
    async deleteCalendarEvent(
        @Param('calendarId') calendarId: string,
        @Param('eventId') eventId: string,
        @Token() token: AccessTokenPayload,
    ): Promise<DeleteCalendarEventRes> {
        await this.calendarService.validateUserMemberOfCalendar(
            +calendarId,
            token.userId,
        );
        await this.calendarEventService.deleteCalendarEvent(
            +eventId,
            +calendarId,
        );
        return;
    }
}
