import { GroupDto } from 'moyeo-object';
import { MemberObject } from './member.object';
import { GroupEntity } from 'src/entity';

export class GroupObject implements GroupDto {
  id: number;
  name: string;
  description?: string;

  members?: MemberObject[];

  static from(group: GroupEntity): GroupObject {
    const groupObject = new GroupObject();

    groupObject.id = group.id;
    groupObject.name = group.name;
    groupObject.description = group.description;

    if ('members' in group) {
      groupObject.members = group.members
        .filter((member) => !('group' in member))
        .map((member) => MemberObject.from(member));
    }

    return groupObject;
  }
}
