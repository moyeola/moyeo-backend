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
import { DeleteGroupRes, GetGroupRes, PatchGroupRes } from 'moyeo-object';
import { PatchGroupReqDto } from './dto/PatchGroup.req.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Token } from '../auth/decorator/token.decorator';
import { AccessTokenPayload } from '../auth/types/accessTokenPayload';
import { PostGroupReqDto } from './dto/PostGroup.req.dto';

@Auth()
@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Get('')
    async getGroups(@Token() token: AccessTokenPayload) {
        const groups = await this.groupService.getGroups(token.userId);
        return {
            groups,
        };
    }

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
}
