import { ReportEntity, ReportReasonEnum, UserEntity } from '@/entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserReportService {
    constructor(
        @InjectRepository(ReportEntity)
        private readonly reportRepository: Repository<ReportEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async reportUser(
        userId: number,
        reporterId: number,
        data: {
            reason: ReportReasonEnum;
            description?: string;
        },
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

        const reporter = await this.userRepository.findOne({
            where: {
                id: reporterId,
            },
        });

        if (!reporter) {
            throw new NotFoundException({
                code: 'reporter_not_found',
            });
        }

        const { reason, description } = data;

        const report = ReportEntity.create(user, reporter, reason, description);

        await this.reportRepository.save(report);
    }
}
