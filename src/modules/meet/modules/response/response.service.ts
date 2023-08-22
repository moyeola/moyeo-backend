import {
    MeetEntity,
    MeetResponseEntity,
    MemberEntity,
    UserEntity,
} from '@/entity';
import { MeetResponseObject } from '@/object';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MeetResponseService {
    constructor(
        @InjectRepository(MeetEntity)
        private readonly meetRepository: Repository<MeetEntity>,
        @InjectRepository(MeetResponseEntity)
        private readonly meetResponseRepository: Repository<MeetResponseEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,
    ) {}

    async getMeetResponse(id: number): Promise<MeetResponseObject> {
        const meetResponse = await this.meetResponseRepository.findOne({
            where: {
                id,
            },
            relations: ['meet', 'responserUser', 'responserMember'],
        });
        if (!meetResponse) {
            throw new NotFoundException({
                code: 'MEET_RESPONSE_NOT_FOUND',
            });
        }
        return MeetResponseObject.from(meetResponse);
    }

    async postMeetResponse(
        meetId: number,
        userId: number | null,
        data: {
            times: {
                start: string;
                end: string;
            }[];
            responser:
                | {
                      type: 'user';
                  }
                | {
                      type: 'member';
                      memberId: number;
                  }
                | {
                      type: 'guest';
                      guest: {
                          name: string;
                          email: string;
                      };
                  };
        },
    ) {
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

        let responser:
            | {
                  type: 'user';
                  user: UserEntity;
              }
            | {
                  type: 'member';
                  member: MemberEntity;
              }
            | {
                  type: 'guest';
                  guest: {
                      name: string;
                      email: string;
                  };
              };

        if (data.responser.type === 'user') {
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
            responser = {
                type: 'user',
                user,
            };
        } else if (data.responser.type === 'member') {
            const member = await this.memberRepository.findOne({
                where: {
                    id: data.responser.memberId,
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
            responser = {
                type: 'member',
                member,
            };
        } else if (data.responser.type === 'guest') {
            responser = {
                type: 'guest',
                guest: {
                    name: data.responser.guest.name,
                    email: data.responser.guest.email,
                },
            };
        }

        const meetResponse = MeetResponseEntity.create({
            meet,
            responser,
            times: data.times,
        });
        await this.meetResponseRepository.save(meetResponse);
    }

    async patchMeetResponse(
        id: number,
        userId: number,
        data: {
            times?: {
                start: string;
                end: string;
            }[];
        },
    ) {
        const meetResponse = await this.meetResponseRepository.findOne({
            where: {
                id,
            },
            relations: ['meet', 'responserUser', 'responserMember'],
        });
        if (!meetResponse) {
            throw new NotFoundException({
                code: 'MEET_RESPONSE_NOT_FOUND',
            });
        }

        if (meetResponse.responserType === 'user') {
            if (meetResponse.responserUser.id !== userId) {
                throw new BadRequestException({
                    code: 'NOT_CREATOR',
                });
            }
        } else if (meetResponse.responserType === 'member') {
            if (meetResponse.responserMember.user.id !== userId) {
                throw new BadRequestException({
                    code: 'NOT_CREATOR',
                });
            }
        } else if (meetResponse.responserType === 'guest') {
            throw new BadRequestException({
                code: 'NOT_CREATOR',
            });
        }

        if (data.times) {
            meetResponse.times = JSON.stringify(data.times);
        }
        await this.meetResponseRepository.save(meetResponse);
    }
}
