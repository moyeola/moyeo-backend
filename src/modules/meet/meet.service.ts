import { MeetEntity } from '@/entity/meet.entity';
import { MeetResponseEntity } from '@/entity/meetResponse.entity';
import { MeetObject } from '@/object/meet.object';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MeetService {
    constructor(
        @InjectRepository(MeetEntity)
        private readonly meetRepository: Repository<MeetEntity>,
        @InjectRepository(MeetResponseEntity)
        private readonly meetResponseRepository: Repository<MeetResponseEntity>,
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
}
