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
    nullable: true,
  })
  @MaxLength(CommonConstant.GROUP_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @OneToMany(() => MemberEntity, (member) => member.group)
  members: MemberEntity[];

  static create(name: string): GroupEntity {
    const group = new GroupEntity();
    group.name = name;

    return group;
  }
}
