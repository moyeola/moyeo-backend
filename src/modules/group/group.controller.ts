import { Controller, Get, Param } from '@nestjs/common';
import { GroupService } from './group.service';
import { GetGroupRes } from 'moyeo-object';

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
}
