import { Controller, Get, Param, Patch } from '@nestjs/common';
import { MemberService } from './member.service';
import { Auth } from '@/modules/auth/decorator/auth.decorator';
import { Token } from '@/modules/auth/decorator/token.decorator';
import { AccessTokenPayload } from '@/modules/auth/types/accessTokenPayload';

@Auth()
@Controller('/groups/:groupId/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/')
  async getMembers(
    @Param('groupId') groupId: string,
    @Token() token: AccessTokenPayload,
  ) {
    await this.memberService.checkUserInGroup(token.userId, +groupId);
    const res = await this.memberService.getMembersByGroupId(+groupId);
    return {
      members: res,
    };
  }

  @Get(':memberId')
  async getMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @Token() token: AccessTokenPayload,
  ) {
    await this.memberService.checkUserInGroup(token.userId, +groupId);
    return {
      member: await this.memberService.getMemberById(+memberId),
    };
  }

  @Patch(':memberId')
  async patchMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @Token() token: AccessTokenPayload,
  ) {}
}
