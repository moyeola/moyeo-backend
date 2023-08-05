import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity, MemberEntity, UserEntity } from '@/entity';

@Module({
  controllers: [MemberController],
  providers: [MemberService],
  imports: [TypeOrmModule.forFeature([UserEntity, GroupEntity, MemberEntity])],
})
export class MemberModule {}
