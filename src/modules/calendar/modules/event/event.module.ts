import { Module } from '@nestjs/common';
import { CalendarEventController } from './event.controller';
import { CalendarEventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEntity, CalendarEventEntity, MemberEntity } from '@/entity';
import { CalendarService } from '../../calendar.service';

@Module({
  controllers: [CalendarEventController],
  providers: [CalendarEventService, CalendarService],
  imports: [
    TypeOrmModule.forFeature([
      CalendarEntity,
      CalendarEventEntity,
      MemberEntity,
    ]),
  ],
})
export class CalendarEventModule {}
