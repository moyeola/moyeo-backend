import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity, UserEntity } from '@/entity';

@Module({
  controllers: [DevController],
  providers: [DevService],
  imports: [TypeOrmModule.forFeature([UserEntity, PermissionEntity])],
})
export class DevModule {}
