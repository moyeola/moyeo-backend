import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity, UserEntity } from '@/entity';
import { DevAuthService } from './dev.auth.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
    controllers: [DevController],
    providers: [DevService, DevAuthService],
    imports: [
        AuthModule,
        UserModule,
        TypeOrmModule.forFeature([UserEntity, PermissionEntity]),
    ],
})
export class DevModule {}
