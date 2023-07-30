import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenPayload } from '../auth/types/accessTokenPayload';
import { Token } from '../auth/decorator/token.decorator';
import { DeleteUserMeRes, GetUserMeRes, PatchUserMeRes } from 'moyeo-object';
import { PatchUserMeReqDto } from './dto/PatchUserMe.req.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getUserMe(@Token() token?: AccessTokenPayload): Promise<GetUserMeRes> {
    const userId = token.userId;
    const user = await this.userService.getUser(userId);
    return {
      user,
    };
  }

  @Patch('me')
  async patchUserMe(
    @Token() token: AccessTokenPayload,
    @Body() dto: PatchUserMeReqDto,
  ): Promise<PatchUserMeRes> {
    const userId = token.userId;
    await this.userService.patchUser(userId, dto);
    return;
  }

  @Delete('me')
  async deleteUserMe(
    @Token() token: AccessTokenPayload,
  ): Promise<DeleteUserMeRes> {
    const userId = token.userId;
    await this.userService.deleteUser(userId);
    return;
  }
}
