import { GroupEntity, GroupRole, MemberEntity, UserEntity } from '@/entity';
import { GroupObject, MemberObject } from '@/object';
import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { GetGroupRes } from 'moyeo-object';
import { Embed, Webhook } from '@hyunsdev/discord-webhook';

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
        member.role = GroupRole.OWNER;
        await this.memberRepository.save(member);

        // 그룹 캘린더 생성
        await this.calendarService.createCalendar({
            owner: {
                type: 'group',
                group,
            },
        });

        const client = new Webhook(
            process.env.DISCORD_WEBHOOK_NEW,
            'Moyeo 봇',
            'https://moyeo.la/moyeo.png',
        );

        const embed: Embed = new Embed({
            title: '새로운 그룹이 생성되었어요.',
            thumbnail: {
                url: user.profileImageUrl,
            },
            fields: [
                {
                    name: 'Group',
                    value: `[ ${group.id} ] ${group.name}`,
                },
                {
                    name: '소개',
                    value: `${group.description}`,
                },
                {
                    name: 'Owner',
                    value: `[ ${user.id} ] ${user.name}(${user.email})`,
                },
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: `moyoe.la`,
                icon_url: 'https://moyeo.la/moyeo.png',
            },
            color: 0x39acff,
        });
        await client.send('', [embed]);

        return GroupObject.from(group);
    }

    async getGroup(groupId: number): Promise<GetGroupRes['group']> {
        const group = await this.groupRepository.findOne({
            where: {
                id: groupId,
            },
            relations: ['members', 'members.user', 'members.user.permissions'],
        });

        if (!group) {
            throw new NotFoundException({
                code: 'group_not_found',
            });
        }

        const groupDto = GroupObject.from(group) as GetGroupRes['group'];
        return groupDto;
    }

    async getGroupInviteCode(groupId: number) {
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

        return group.inviteCode;
    }

    async patchGroup(
        groupId: number,
        data: {
            name?: string;
            description?: string;
            status?: 'ACTIVE' | 'INACTIVE';
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

        await this.memberRepository.softDelete({
            group: {
                id: groupId,
            },
        });

        await this.groupRepository.softDelete({
            id: groupId,
        });
    }

    async postInviteMemberByInviteCode(userId: number, inviteCode: string) {
        const group = await this.groupRepository.findOne({
            where: {
                inviteCode,
            },
        });

        if (!group) {
            throw new NotFoundException({
                code: 'group_not_found',
            });
        }

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

        const existMember = await this.memberRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
                group: {
                    id: group.id,
                },
            },
        });

        if (existMember) {
            throw new ForbiddenException({
                code: 'already_in_group',
                groupId: group.id,
            });
        }

        let member = MemberEntity.create(user, group);
        member = await this.memberRepository.save(member);

        member = await this.memberRepository.findOne({
            where: {
                id: member.id,
            },
            relations: ['user', 'group'],
        });
        return MemberObject.from(member);
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

    async checkMemberIsInGroup(
        userId: number,
        groupId: number,
    ): Promise<boolean> {
        const res = await this.isUserInGroup(userId, groupId);
        if (!res) {
            throw new NotFoundException({
                code: 'group_not_found',
            });
        }
        return true;
    }
}
