import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import {
  PermissionEntity,
  UserEntity,
  UserPermission,
  UserStatus,
} from '@/entity';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserController', () => {
  let userController: UserController;
  let userRepository: MockRepository<UserEntity>;

  beforeEach(async () => {
    const mockUserPermission = new PermissionEntity();
    mockUserPermission.id = 1;
    mockUserPermission.permission = UserPermission.ADMIN;

    const mockUser = new UserEntity();
    mockUser.id = 1;
    mockUser.name = 'name';
    mockUser.profileImageUrl = '';
    mockUser.status = UserStatus.NEW;
    mockUser.permissions = [mockUserPermission];

    const mockUserRepository = () => ({
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(() => mockUser),
      softDelete: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userRepository = module.get<MockRepository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('유저 정보 조회', async () => {
    const res = await userController.getUser('1', {
      userId: 1,
      permissions: [],
      type: 'user',
      version: 'v1',
    });

    expect(res).toBeDefined();
  });
});
