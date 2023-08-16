import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { GoogleAuthReqDto } from './dto/googleAuth.req.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body() dto: GoogleAuthReqDto) {
    return await this.authService.googleAuth(dto.token, dto.redirectUri);
  }
}
