import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './common/baseEntity';
import { UserEntity } from './user.entity';

export enum UserPermission {
  'ADMIN' = 'ADMIN',
}

@Entity('permission')
export class PermissionEntity extends BaseEntity {
  @Column({ type: 'enum', enum: UserPermission })
  permission: UserPermission;

  @ManyToOne(() => UserEntity, (user) => user.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  static create(
    permission: UserPermission,
    user: UserEntity,
  ): PermissionEntity {
    const permissionEntity = new PermissionEntity();
    permissionEntity.permission = permission;
    permissionEntity.user = user;

    return permissionEntity;
  }
}
