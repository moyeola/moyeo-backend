import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { MemberEntity } from './member.entity';
import { CommonConstant } from './constant/common.constant';

@Entity('group')
export class GroupEntity extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @MaxLength(CommonConstant.GROUP_NAME_MAX_LENGTH)
    name: string;

    @Column({
        unique: true,
        nullable: false,
    })
    @IsNotEmpty()
    inviteCode: string;

    @Column({
        nullable: true,
    })
    @MaxLength(CommonConstant.GROUP_DESCRIPTION_MAX_LENGTH)
    description?: string;

    @Column({
        default: 'ACTIVE',
    })
    status: 'ACTIVE' | 'INACTIVE';

    @OneToMany(() => MemberEntity, (member) => member.group)
    members: MemberEntity[];

    static create(name: string, description?: string): GroupEntity {
        const group = new GroupEntity();
        group.name = name;
        group.description = description;
        group.status = 'ACTIVE';
        group.inviteCode = Math.random().toString(36).slice(2, 11);

        return group;
    }
}
