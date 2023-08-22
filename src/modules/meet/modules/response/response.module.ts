import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    MeetEntity,
    MeetResponseEntity,
    MemberEntity,
    UserEntity,
} from '@/entity';
import { MeetResponseController } from './response.controller';
import { MeetResponseService } from './response.service';

@Module({
    controllers: [MeetResponseController],
    providers: [MeetResponseService],
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            MemberEntity,
            MeetEntity,
            MeetResponseEntity,
        ]),
    ],
})
export class MeetResponseModule {}
