import {
    GroupEntity,
    GroupRole,
    MemberEntity,
    UserEntity,
    UserStatus,
} from '@/entity';
import { GroupController } from './group.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupService } from './group.service';
import { TokenService } from '../auth/services/token.service';

const createMockUser = (id: number, name: string) => {
    const user = new UserEntity();
    user.id = id;
    user.name = name;
    user.profileImageUrl = '';
    user.status = UserStatus.ACTIVE;
    user.permissions = [];
    user.members = [];
    return user;
};

const createMockGroup = (id: number, name: string) => {
    const group = new GroupEntity();
    group.id = id;
    group.name = name;
    group.members = [];
    return group;
};

interface GroupRepository {
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    softDelete: jest.Mock;
}

const createMockMember = (
    id: number,
    nickname: string,
    user: UserEntity,
    group: GroupEntity,
    role: GroupRole,
) => {
    const member = new MemberEntity();
    member.id = id;
    member.nickname = nickname;
    member.user = user;
    member.group = group;
    member.role = role;
    return member;
};

describe('GroupController', () => {
    let groupController: GroupController;
    let groupRepository: GroupRepository;

    beforeEach(async () => {
        const mockUser = createMockUser(1, 'userName');
        const mockGroup = createMockGroup(1, 'groupName');
        const mockMember = createMockMember(
            1,
            'nickname',
            mockUser,
            mockGroup,
            GroupRole.OWNER,
        );
        mockUser.members.push(mockMember);
        mockGroup.members.push(mockMember);

        groupRepository = {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn().mockResolvedValue(mockGroup),
            update: jest.fn(),
            softDelete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [GroupController],
            providers: [
                GroupService,
                TokenService,
                {
                    provide: getRepositoryToken(GroupEntity),
                    useValue: groupRepository,
                },
            ],
        }).compile();

        groupController = module.get<GroupController>(GroupController);
    });

    describe('getGroup', () => {
        it('should return group', async () => {
            const group = await groupController.getGroup('1');
            expect(groupRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
                relations: ['members'],
            });

            expect(group.group.id).toBe(1);
            expect(group.group.name).toBe('groupName');
        });
    });

    describe('patchGroup', () => {
        it('should patch group', async () => {
            await groupController.patchGroup('1', {
                name: 'newGroupName',
                description: 'newDescription',
            });
            expect(groupRepository.update).toHaveBeenCalledWith(
                {
                    id: 1,
                },
                {
                    name: 'newGroupName',
                    description: 'newDescription',
                },
            );
        });
    });

    describe('deleteGroup', () => {
        it('should delete group', async () => {
            await groupController.deleteGroup('1');
            expect(groupRepository.softDelete).toHaveBeenCalledWith({
                id: 1,
            });
        });
    });
});
