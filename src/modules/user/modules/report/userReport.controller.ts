import { Body, Controller, Post } from '@nestjs/common';
import { UserReportService } from './userReport.service';
import { Auth } from '@/modules/auth/decorator/auth.decorator';
import { AccessTokenPayload } from '@/modules/auth/types/accessTokenPayload';
import { Token } from '@/modules/auth/decorator/token.decorator';
import { PostUserReportReqDto } from './dto/PostUserReport.req.dto';

@Auth()
@Controller('users/:userId/reports')
export class UserReportController {
  constructor(private readonly userReportService: UserReportService) {}

  @Post('/')
  async reportUser(
    @Token() token: AccessTokenPayload,
    @Body() dto: PostUserReportReqDto,
  ) {
    const userId = token.userId;
    await this.userReportService.reportUser(userId, token.userId, {
      reason: dto.reason,
      description: dto.description,
    });
    return;
  }
}
