import { MeetEntity, MemberEntity, UserEntity } from '@/entity';
import { MeetObject } from '@/object';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MeetService {
    constructor(
        @InjectRepository(MeetEntity)
        private readonly meetRepository: Repository<MeetEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,
    ) {}

    async getMeet(id: number): Promise<MeetObject> {
        const meet = await this.meetRepository.findOne({
            where: {
                id,
            },
            relations: [
                'creatorUser',
                'creatorMember',
                'creatorMember.group',
                'responses',
                'responses.responserUser',
                'responses.responserMember',
                'responses.responserMember.group',
            ],
        });
        return MeetObject.from(meet);
    }

    async getMeets(userId: number): Promise<MeetObject[]> {
        const meets = await this.meetRepository.find({
            where: [
                {
                    creatorUser: {
                        id: userId,
                    },
                },
                {
                    creatorMember: {
                        user: {
                            id: userId,
                        },
                    },
                },
            ],
            relations: ['creatorUser', 'creatorMember', 'creatorMember.group'],
        });
        return meets.map((meet) => MeetObject.from(meet));
    }

    async postMeet(
        userId: number,
        data: {
            title: string;
            description?: string;
            dates: string[];
            startTimeAt: string;
            endTimeAt: string;
            creator:
                | {
                      type: 'user';
                  }
                | {
                      type: 'member';
                      memberId: number;
                  };
        },
    ) {
        const creatorType = data.creator.type;
        let creator:
            | {
                  type: 'user';
                  user: UserEntity;
              }
            | {
                  type: 'member';
                  member: MemberEntity;
              };

        if (creatorType === 'user') {
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                throw new NotFoundException({
                    code: 'USER_NOT_FOUND',
                });
            }
            creator = {
                type: 'user',
                user: user,
            };
        }
        if (creatorType === 'member') {
            const member = await this.memberRepository.findOne({
                where: {
                    id: data.creator.memberId,
                },
            });
            if (!member) {
                throw new NotFoundException({
                    code: 'MEMBER_NOT_FOUND',
                });
            }
            if (member.user.id !== userId) {
                throw new BadRequestException({
                    code: 'MEMBER_NOT_BELONG_TO_USER',
                });
            }
            creator = {
                type: 'member',
                member: member,
            };
        }

        const meet = MeetEntity.create({
            title: data.title,
            description: data.description,
            dates: data.dates,
            startTimeAt: data.startTimeAt,
            endTimeAt: data.endTimeAt,
            creator: creator,
        });
        await this.meetRepository.save(meet);
    }

    async patchMeet(
        id: number,
        data: {
            title?: string;
            description?: string;
            dates?: string[];
            startTimeAt?: string;
            endTimeAt?: string;
        },
    ) {
        const meet = await this.meetRepository.findOne({
            where: {
                id,
            },
        });
        if (!meet) {
            throw new NotFoundException({
                code: 'MEET_NOT_FOUND',
            });
        }

        if (data.title) {
            meet.title = data.title;
        }
        if (data.description) {
            meet.description = data.description;
        }
        if (data.dates) {
            meet.dates = JSON.stringify(data.dates);
        }
        if (data.startTimeAt) {
            meet.startTimeAt = data.startTimeAt;
        }
        if (data.endTimeAt) {
            meet.endTimeAt = data.endTimeAt;
        }

        await this.meetRepository.save(meet);
    }

    async deleteMeet(id: number) {
        const meet = await this.meetRepository.findOne({
            where: {
                id,
            },
        });
        if (!meet) {
            throw new NotFoundException({
                code: 'MEET_NOT_FOUND',
            });
        }

        await this.meetRepository.remove(meet);
    }

    async isUserCreator(userId: number, meetId: number): Promise<boolean> {
        const meet = await this.meetRepository.findOne({
            where: {
                id: meetId,
            },
            relations: ['creatorUser', 'creatorMember'],
        });
        if (!meet) {
            throw new NotFoundException({
                code: 'MEET_NOT_FOUND',
            });
        }

        if (meet.creatorType === 'user') {
            return meet.creatorUser.id === userId;
        } else {
            return meet.creatorMember.user.id === userId;
        }
    }
}
