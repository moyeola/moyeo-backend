import { Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserRes } from 'moyeo-object';
import { AccessTokenPayload } from '../auth/types/accessTokenPayload';
import { Token } from '../auth/decorator/token.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async getUser(
    @Param('userId') userId: string,
    @Token() token?: AccessTokenPayload,
  ): Promise<GetUserRes> {
    const id = userId === 'me' ? token.userId : parseInt(userId);

    if (
      userId !== 'me' &&
      !token.permissions.includes('admin') &&
      id !== token.userId
    ) {
      throw new UnauthorizedException({
        code: 'permission_denied',
      });
    }

    const user = await this.userService.getUser(id);
    return {
      user,
    };
  }
}
