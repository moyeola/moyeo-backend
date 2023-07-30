import { GroupEntity } from '@/entity';
import { GroupObject } from '@/object';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async getGroup(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: ['members'],
    });

    const groupDto = GroupObject.from(group);
    return groupDto;
  }
}
