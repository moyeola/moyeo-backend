import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

@Global()
@Module({
  providers: [TokenService, AuthService],
  exports: [TokenService, AuthService],
})
export class AuthModule {}
