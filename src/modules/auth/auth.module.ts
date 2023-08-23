import { Global, Module } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google.auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity, UserEntity } from '@/entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { CalendarModule } from '../calendar/calendar.module';

@Global()
@Module({
    controllers: [AuthController],
    imports: [
        TypeOrmModule.forFeature([AuthEntity, UserEntity]),
        CalendarModule,
    ],
    providers: [AuthService, TokenService, GoogleAuthService, UserService],
    exports: [TokenService, AuthService],
})
export class AuthModule {}
