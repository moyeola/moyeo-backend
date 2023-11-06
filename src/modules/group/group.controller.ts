import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
    DeleteGroupRes,
    GetGroupRes,
    PatchGroupRes,
    PostGroupInviteRes,
} from 'moyeo-object';
import { PatchGroupReqDto } from './dto/PatchGroup.req.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Token } from '../auth/decorator/token.decorator';
import { AccessTokenPayload } from '../auth/types/accessTokenPayload';
import { PostGroupReqDto } from './dto/PostGroup.req.dto';

@Auth()
@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Post('')
    async postGroup(
        @Body() dto: PostGroupReqDto,
        @Token() token: AccessTokenPayload,
    ) {
        const group = await this.groupService.postGroup(dto, token.userId);
        return {
            group,
        };
    }

    @Post('invite')
    async postGroupInvite(
        @Body() dto: { inviteCode: string },
        @Token() token: AccessTokenPayload,
    ): Promise<PostGroupInviteRes> {
        const member = await this.groupService.postInviteMemberByInviteCode(
            token.userId,
            dto.inviteCode,
        );
        return {
            member,
        };
    }

    @Get(':groupId')
    async getGroup(@Param('groupId') groupId: string): Promise<GetGroupRes> {
        const group = await this.groupService.getGroup(parseInt(groupId));
        return {
            group,
        };
    }

    @Patch(':groupId')
    async patchGroup(
        @Param('groupId') groupId: string,
        @Body() dto: PatchGroupReqDto,
    ): Promise<PatchGroupRes> {
        await this.groupService.patchGroup(parseInt(groupId), dto);
        return;
    }

    @Delete(':groupId')
    async deleteGroup(
        @Param('groupId') groupId: string,
    ): Promise<DeleteGroupRes> {
        await this.groupService.deleteGroup(parseInt(groupId));
        return;
    }

    @Get(':groupId/invite-code')
    async getGroupInviteCode(
        @Param('groupId') groupId: string,
        @Token() token: AccessTokenPayload,
    ) {
        await this.groupService.checkMemberIsInGroup(token.userId, +groupId);
        const inviteCode = await this.groupService.getGroupInviteCode(
            parseInt(groupId),
        );
        return {
            inviteCode,
        };
    }
}
