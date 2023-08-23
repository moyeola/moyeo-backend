import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEntity, UserEntity } from '@/entity';
import { UserReportModule } from './modules/report/userReport.module';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        TypeOrmModule.forFeature([UserEntity, CalendarEntity]),
        UserReportModule,
        CalendarModule,
    ],
    exports: [UserService],
})
export class UserModule {}
