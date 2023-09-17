import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { UserEntity } from './user.entity';

export enum ReportStatusEnum {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

export enum ReportReasonEnum {
    SPAM = 'SPAM',
    GENERAL = 'GENERAL',
}

@Entity('report')
export class ReportEntity extends BaseEntity {
    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @ManyToOne(() => UserEntity)
    reporter: UserEntity;

    @Column({
        type: 'enum',
        enum: ReportStatusEnum,
        default: ReportStatusEnum.PENDING,
    })
    status: ReportStatusEnum;

    @Column({
        type: 'enum',
        enum: ReportReasonEnum,
        default: ReportReasonEnum.GENERAL,
    })
    reason: ReportReasonEnum;

    @Column({
        nullable: true,
    })
    description?: string;

    static create(
        user: UserEntity,
        reporter: UserEntity,
        reason?: ReportReasonEnum,
        description?: string,
    ): ReportEntity {
        const report = new ReportEntity();
        report.user = user;
        report.reporter = reporter;
        report.reason = reason;
        report.description = description;

        return report;
    }
}
