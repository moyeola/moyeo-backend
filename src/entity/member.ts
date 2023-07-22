import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { UserEntity } from './user.entity';
import { GroupEntity } from './group.entity';
import { MaxLength } from 'class-validator';
import { CommonConstant } from './constant/common.constant';

export enum GroupRole {
  'OWNER' = 'OWNER',
  'MEMBER' = 'MEMBER',
}

@Entity('member')
export class MemberEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.members, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => GroupEntity, (group) => group.members, {
    onDelete: 'CASCADE',
  })
  group: GroupEntity;

  @Column({
    type: 'enum',
    enum: GroupRole,
    default: GroupRole.MEMBER,
  })
  role: GroupRole;

  @Column({
    nullable: true,
  })
  @MaxLength(
    CommonConstant.USER_NAME_PREFIX_MAX_LENGTH +
      CommonConstant.USER_NAME_MAX_LENGTH,
  )
  nickname?: string;

  static create(user: UserEntity, group: GroupEntity): MemberEntity {
    const userToGroup = new MemberEntity();
    userToGroup.user = user;
    userToGroup.group = group;

    return userToGroup;
  }
}
