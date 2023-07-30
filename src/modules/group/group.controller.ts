import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { GroupService } from './group.service';
import { DeleteGroupRes, GetGroupRes, PatchGroupRes } from 'moyeo-object';
import { PatchGroupReqDto } from './dto/PatchGroup.req.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@Auth()
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

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
