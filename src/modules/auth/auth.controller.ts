import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { GoogleAuthReqDto } from './dto/googleAuth.req.dto';
import { PostAuthGoogleRes } from 'moyeo-object';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('google')
    async googleAuth(
        @Body() dto: GoogleAuthReqDto,
    ): Promise<PostAuthGoogleRes> {
        return await this.authService.googleAuth(dto.token, dto.redirectUri);
    }
}
