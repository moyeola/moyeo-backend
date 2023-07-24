import { Injectable } from '@nestjs/common';
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

    return UserObject.from(user);
  }
}
