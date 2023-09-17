import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity, CalendarEntity, UserEntity } from '@/entity';
import { UserReportModule } from './modules/report/userReport.module';
import { CalendarModule } from '../calendar/calendar.module';
import { UserNotificationModule } from './modules/notification/notification.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        TypeOrmModule.forFeature([UserEntity, CalendarEntity, AuthEntity]),
        UserReportModule,
        CalendarModule,
        UserNotificationModule,
    ],
    exports: [UserService],
})
export class UserModule {}
