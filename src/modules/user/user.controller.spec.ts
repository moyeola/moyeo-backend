import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
    PermissionEntity,
    UserEntity,
    UserPermission,
    UserStatus,
} from '@/entity';
import { getRepositoryToken } from '@nestjs/typeorm';

// 1. Mock 데이터 생성 함수 분리
const createMockUserPermission = (id: number, permission: UserPermission) => {
    const mockUserPermission = new PermissionEntity();
    mockUserPermission.id = id;
    mockUserPermission.permission = permission;
    return mockUserPermission;
};

const createMockUser = (
    id: number,
    name: string,
    status: UserStatus,
    permissions: PermissionEntity[],
) => {
    const mockUser = new UserEntity();
    mockUser.id = id;
    mockUser.name = name;
    mockUser.profileImageUrl = '';
    mockUser.status = status;
    mockUser.permissions = permissions;
    return mockUser;
};

// 2. UserRepository 인터페이스 정의
interface UserRepository {
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    softDelete: jest.Mock;
}

interface UserToken {
    userId: number;
    permissions: UserPermission[];
    type: 'user';
    version: 'v1';
}

describe('UserController', () => {
    let userController: UserController;
    let userRepository: UserRepository;
    let userToken: UserToken;

    beforeEach(async () => {
        const mockUserPermission = createMockUserPermission(
            1,
            UserPermission.ADMIN,
        );
        const mockUser = createMockUser(1, 'name', UserStatus.NEW, [
            mockUserPermission,
        ]);

        // 3. Mock User Repository 생성 함수 정의
        const createMockUserRepository = () => ({
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(() => mockUser),
            update: jest.fn(),
            softDelete: jest.fn(),
        });
        userRepository = createMockUserRepository();

        // 이후 테스트 케이스에서 공통적으로 사용할 데이터를 변수로 선언
        userToken = {
            userId: 1,
            permissions: [],
            type: 'user',
            version: 'v1',
        };

        // "유저 정보 조회" 테스트를 위한 추가적인 mock 데이터 생성
        const expectedUserData = createMockUser(1, 'name', UserStatus.NEW, [
            createMockUserPermission(1, UserPermission.ADMIN),
        ]);

        // Mock Repository의 findOne 메소드에 대한 반환 값을 미리 지정하여 테스트 케이스에서 사용
        userRepository.findOne.mockReturnValue(expectedUserData);

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: userRepository,
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userRepository = module.get<UserRepository>(
            getRepositoryToken(UserEntity),
        );
    });

    it('should retrieve user information', async () => {
        const expectedUserData = createMockUser(1, 'name', UserStatus.NEW, [
            createMockUserPermission(1, UserPermission.ADMIN),
        ]);

        // 컨트롤러의 getUserMe 메소드 호출
        const res = await userController.getUserMe(userToken);

        // 반환된 데이터와 기대하는 데이터를 비교하여 검증
        expect(res).toBeDefined();
        expect(res.user.id).toEqual(expectedUserData.id);
    });

    it('should update user information', async () => {
        const updateData = {
            name: 'updated name',
            profileImageUrl: '/path/to/image.jpg',
        };

        // 컨트롤러의 patchUserMe 메소드 호출
        await userController.patchUserMe(userToken, updateData);

        // 사용자 정보가 실제로 업데이트되었는지 검증
        expect(userRepository.update).toHaveBeenCalledTimes(1);
        expect(userRepository.update).toHaveBeenCalledWith(
            { id: userToken.userId },
            updateData,
        );
    });

    it('should delete user information', async () => {
        // 컨트롤러의 deleteUserMe 메소드 호출
        await userController.deleteUserMe(userToken);

        // 사용자 정보가 실제로 삭제되었는지 검증
        expect(userRepository.softDelete).toHaveBeenCalledTimes(1);
        expect(userRepository.softDelete).toHaveBeenCalledWith({
            id: userToken.userId,
        });
    });
});
