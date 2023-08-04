import { GroupEntity, MemberEntity, UserEntity } from '@/entity';
import { MemberObject } from '@/object';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async getMembersByGroupId(groupId: number): Promise<MemberObject[]> {
    const res = await this.memberRepository.find({
      where: {
        group: {
          id: groupId,
        },
      },
      relations: ['user'],
    });

    if (!res) {
      throw new NotFoundException({
        code: 'group_not_found',
      });
    }

    return res.map((member) => {
      return MemberObject.from(member);
    });
  }

  async getMemberById(memberId: number): Promise<MemberObject> {
    const res = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
      relations: ['user'],
    });

    return MemberObject.from(res);
  }

  async patchMember(
    memberId: number,
    data: {
      nickname?: string;
    },
  ) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException({
        code: 'member_not_found',
      });
    }

    await this.memberRepository.update(
      {
        id: memberId,
      },
      {
        nickname: data.nickname,
      },
    );
  }

  async isUserInGroup(userId: number, groupId: number): Promise<boolean> {
    const res = await this.memberRepository.find({
      where: {
        user: {
          id: userId,
        },
        group: {
          id: groupId,
        },
      },
    });

    return res.length > 0;
  }

  async checkUserInGroup(userId: number, groupId: number): Promise<boolean> {
    const res = await this.isUserInGroup(userId, groupId);
    if (!res) {
      throw new NotFoundException({
        code: 'group_not_found',
      });
    }
    return true;
  }
}
