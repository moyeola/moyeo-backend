import { UserEntity } from '@/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from '../auth/services/token.service';
import { UserService } from '../user/user.service';
import { UserObject } from '@/object';

@Injectable()
export class DevService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ) {}

    createAccessToken(userId: number, permissions: string[]) {
        return this.tokenService.createAccessToken(userId, permissions);
    }

    async createUser(data: {
        name: string;
        profileImageUrl: string;
        email: string;
        oAuth: string;
        oAuthId: string;
    }) {
        const user = await this.userService.createUser(data);
        const token = this.createAccessToken(user.id, []);

        return {
            user: UserObject.from(user),
            token,
        };
    }
}
