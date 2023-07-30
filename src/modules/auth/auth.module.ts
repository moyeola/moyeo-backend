import { Global, Module } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google.auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity, UserEntity } from '@/entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  controllers: [AuthController],
  imports: [UserModule, TypeOrmModule.forFeature([AuthEntity, UserEntity])],
  providers: [AuthService, TokenService, GoogleAuthService, UserService],
  exports: [TokenService, AuthService],
})
export class AuthModule {}
