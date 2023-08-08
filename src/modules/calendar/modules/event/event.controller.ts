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
import { GetCalendarEventsRes } from 'moyeo-object';
import { PostCalendarEventReqDto } from './dto/PostCalendarEvent.req.dto';
import { CalendarService } from '../../calendar.service';

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
  ) {
    await this.calendarService.validateUserMemberOfCalendar(
      +calendarId,
      token.userId,
    );
    const event = await this.calendarEventService.getCalendarEventById(
      +eventId,
      +calendarId,
    );
    return {
      event,
    };
  }

  @Post('/')
  async createCalendarEvent(
    @Param('calendarId') calendarId: string,
    @Token() token: AccessTokenPayload,
    @Body() data: PostCalendarEventReqDto,
  ) {
    await this.calendarService.validateUserMemberOfCalendar(
      +calendarId,
      token.userId,
    );
    const event = await this.calendarEventService.createCalendarEvent(
      +calendarId,
      token.userId,
      data,
    );
    return {
      event,
    };
  }

  @Patch('/:eventId')
  async patchCalendarEvent(
    @Param('calendarId') calendarId: string,
    @Param('eventId') eventId: string,
    @Token() token: AccessTokenPayload,
    @Body() data: PostCalendarEventReqDto,
  ) {
    await this.calendarService.validateUserMemberOfCalendar(
      +calendarId,
      token.userId,
    );
    const event = await this.calendarEventService.patchCalendarEvent(
      +eventId,
      +calendarId,
      data,
    );
    return {
      event,
    };
  }

  @Delete('/:eventId')
  async deleteCalendarEvent(
    @Param('calendarId') calendarId: string,
    @Param('eventId') eventId: string,
    @Token() token: AccessTokenPayload,
  ) {
    await this.calendarService.validateUserMemberOfCalendar(
      +calendarId,
      token.userId,
    );
    await this.calendarEventService.deleteCalendarEvent(+eventId, +calendarId);
    return;
  }
}
