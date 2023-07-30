import { UserDto } from 'moyeo-object';
import { MemberObject } from './member.object';
import { UserEntity } from 'src/entity';

export class UserObject implements UserDto {
  id: number;
  name: string;
  profileImageUrl: string;
  status: 'NEW' | 'ACTIVE';
  permissions: {
    permission: 'ADMIN';
  }[];

  members?: MemberObject[];

  static from(user: UserEntity): UserObject {
    const userObject = new UserObject();

    userObject.id = user.id;
    userObject.name = user.name;
    userObject.profileImageUrl = user.profileImageUrl;
    userObject.status = user.status;
    userObject.permissions = user.permissions.map((permission) => ({
      permission: permission.permission,
    }));

    if ('members' in user) {
      userObject.members = user.members
        .filter((member) => !('user' in member))
        .map((member) => MemberObject.from(member));
    }

    return userObject;
  }
}
