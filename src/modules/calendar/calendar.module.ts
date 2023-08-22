import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEntity, CalendarEventEntity, MemberEntity } from '@/entity';
import { CalendarEventModule } from './modules/event/event.module';

@Module({
    controllers: [CalendarController],
    providers: [CalendarService],
    imports: [
        TypeOrmModule.forFeature([
            CalendarEntity,
            CalendarEventEntity,
            MemberEntity,
        ]),
        CalendarEventModule,
    ],
    exports: [CalendarService],
})
export class CalendarModule {}
