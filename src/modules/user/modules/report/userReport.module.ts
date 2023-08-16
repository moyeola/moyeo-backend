import { Module } from '@nestjs/common';
import { UserReportController } from './userReport.controller';
import { UserReportService } from './userReport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity, UserEntity } from '@/entity';

@Module({
  controllers: [UserReportController],
  providers: [UserReportService],
  imports: [TypeOrmModule.forFeature([UserEntity, ReportEntity])],
})
export class UserReportModule {}
