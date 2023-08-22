import { UserEntity } from '@/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from '../auth/services/token.service';

@Injectable()
export class DevService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly tokenService: TokenService,
    ) {}

    createAccessToken(userId: number, permissions: string[]) {
        return this.tokenService.createAccessToken(userId, permissions);
    }
}
