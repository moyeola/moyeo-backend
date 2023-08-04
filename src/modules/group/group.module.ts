import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity, MemberEntity, UserEntity } from '@/entity';
import { MemberModule } from './module/member.module';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, GroupEntity, MemberEntity]),
    MemberModule,
  ],
})
export class GroupModule {}
