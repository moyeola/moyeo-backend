import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CalendarEntity,
  GroupEntity,
  MemberEntity,
  UserEntity,
} from '@/entity';
import { MemberModule } from './modules/member/member.module';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      GroupEntity,
      MemberEntity,
      CalendarEntity,
    ]),
    MemberModule,
    CalendarModule,
  ],
})
export class GroupModule {}
