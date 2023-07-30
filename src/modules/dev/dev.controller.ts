import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DevService } from './dev.service';
import { DevOnlyGuard } from './dev.guard';
import { PostAccessTokenReqDto } from './dto/PostAccessToken.req.dto';
import { PostDevAuthReqDto } from './dto/PostDevAuth.req.dto';
import { DevAuthService } from './dev.auth.service';

@Controller('dev')
export class DevController {
  constructor(
    private readonly devService: DevService,
    private readonly devAuthService: DevAuthService,
  ) {}

  @Get()
  getDev() {
    return {
      message: 'Hello World!',
    };
  }

  @Post('auth')
  auth(@Body() dto: PostDevAuthReqDto) {
    if (dto.masterToken === process.env.DEV_MASTER_TOKEN) {
      const devToken = this.devAuthService.createDevToken(dto.developerName);
      return {
        devToken,
      };
    } else {
      throw new BadRequestException({
        code: 'wrong_token',
      });
    }
  }

  @Post('access-token')
  @UseGuards(DevOnlyGuard)
  accessToken(@Body() dto: PostAccessTokenReqDto) {
    return {
      accessToken: this.devService.createAccessToken(
        dto.userId,
        dto.permissions,
      ),
    };
  }
}
