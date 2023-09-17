import { MemberDto } from 'moyeo-object';
import { UserObject } from './user.object';
import { GroupObject } from './group.object';
import { MemberEntity } from 'src/entity';

export class MemberObject implements MemberDto {
    id: number;
    nickname: string;
    role: 'OWNER' | 'MEMBER';
    createdAt: string;

    user?: UserObject;
    group?: GroupObject;

    static from(member: MemberEntity): MemberObject {
        const memberObject = new MemberObject();

        memberObject.id = member.id;
        memberObject.nickname = member.nickname;
        memberObject.role = member.role;

        if (member?.user && !member?.user?.members) {
            memberObject.user = UserObject.from(member.user);
        }

        if (member?.group && !member.group.members) {
            memberObject.group = GroupObject.from(member.group);
        }

        return memberObject;
    }
}
