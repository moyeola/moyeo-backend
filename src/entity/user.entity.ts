import { Auth, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { PermissionEntity } from './permission.entity';
import { AuthEntity } from './auth.entity';
import { MemberEntity } from './member';
import { CommonConstant } from './constant/common.constant';

export enum UserStatus {
  'NEW' = 'NEW',
  'ACTIVE' = 'ACTIVE',
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @MaxLength(
    CommonConstant.USER_NAME_PREFIX_MAX_LENGTH +
      CommonConstant.USER_NAME_MAX_LENGTH,
  )
  name: string;

  @Column({ type: 'text' })
  profileImageUrl: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.NEW,
  })
  status: UserStatus;

  @OneToMany(() => MemberEntity, (member) => member.user)
  members: MemberEntity[];

  @OneToMany(() => PermissionEntity, (permission) => permission.user)
  permissions: PermissionEntity[];

  @OneToMany(() => AuthEntity, (auth) => auth.user)
  auth: Auth;

  static create(): UserEntity {
    const user = new UserEntity();

    return user;
  }
}
