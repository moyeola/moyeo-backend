import { GroupEntity, MemberEntity, UserEntity } from '@/entity';
import { GroupObject } from '@/object';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly calendarService: CalendarService,
  ) {}

  async postGroup(
    data: {
      name: string;
      description?: string;
    },
    userId: number,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'user_not_found',
      });
    }

    let group = GroupEntity.create(data.name, data.description);
    group = await this.groupRepository.save(group);

    const member = MemberEntity.create(user, group);
    await this.memberRepository.save(member);

    // 그룹 캘린더 생성
    await this.calendarService.createCalendar(group);

    return group;
  }

  async getGroup(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: ['members'],
    });

    if (!group) {
      throw new NotFoundException({
        code: 'group_not_found',
      });
    }

    const groupDto = GroupObject.from(group);
    return groupDto;
  }

  async patchGroup(
    groupId: number,
    data: {
      name?: string;
      description?: string;
    },
  ) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException({
        code: 'group_not_found',
      });
    }

    await this.groupRepository.update(
      {
        id: groupId,
      },
      data,
    );
  }

  async deleteGroup(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException({
        code: 'group_not_found',
      });
    }

    await this.groupRepository.softDelete({
      id: groupId,
    });
  }
}
