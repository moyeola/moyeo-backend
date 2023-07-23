import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserRes } from 'moyeo-object';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(): Promise<GetUserRes> {
    const user = await this.userService.getUser(1);
    return {
      user,
    };
  }
}
