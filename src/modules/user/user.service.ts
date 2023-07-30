import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/entity';
import { UserObject } from '@/object';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUser(userId: number): Promise<UserObject> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['permissions', 'members', 'members.group'],
    });

    if (!user)
      throw new NotFoundException({
        code: 'user_not_found',
      });

    return UserObject.from(user);
  }

  async createUser(
    data: Parameters<typeof UserEntity.create>[0],
  ): Promise<UserEntity> {
    const user = UserEntity.create(data);
    return await this.userRepository.save(user);
  }

  async patchUser(
    userId: number,
    data: {
      name?: string;
      profileImageUrl?: string;
    },
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'user_not_found',
      });
    }

    await this.userRepository.update(
      {
        id: userId,
      },
      data,
    );

    return await this.userRepository.save(user);
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'user_not_found',
      });
    }

    await this.userRepository.softDelete({
      id: userId,
    });
  }
}
