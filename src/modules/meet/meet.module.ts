import { Module } from '@nestjs/common';
import { MeetController } from './meet.controller';
import { MeetService } from './meet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetEntity, MemberEntity, UserEntity } from '@/entity';
import { MeetResponseModule } from './modules/response/response.module';

@Module({
    controllers: [MeetController],
    providers: [MeetService],
    imports: [
        TypeOrmModule.forFeature([UserEntity, MemberEntity, MeetEntity]),
        MeetResponseModule,
    ],
})
export class MeetModule {}
