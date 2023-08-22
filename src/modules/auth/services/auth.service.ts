import { AuthEntity } from '@/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleAuthService } from './google.auth.service';
import { TokenService } from './token.service';
import { UserService } from '@/modules/user/user.service';
import { GoogleAuthResDto } from '../dto/googleAuth.res.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity)
        private authRepository: Repository<AuthEntity>,
        private googleAuthService: GoogleAuthService,
        private tokenService: TokenService,
        private userService: UserService,
    ) {}

    async googleAuth(
        token: string,
        redirectUri?: string,
    ): Promise<GoogleAuthResDto> {
        const profile = await this.googleAuthService.getUserProfile(
            token,
            redirectUri,
        );
        let auth = await this.getAuth(profile.id, 'google');

        if (auth) {
            return {
                accessToken: this.tokenService.createAccessTokenFromUser(
                    auth.user,
                ),
            };
        }

        const user = await this.userService.createUser({
            name: profile.name,
            profileImageUrl: profile.picture,
        });

        auth = await this.createAuth({
            oAuthId: profile.id,
            oAuth: 'google',

            oAuthAccessToken: token,
            oAuthEmail: profile.email,
            oAuthRefreshToken: '',
            user,
        });

        return {
            accessToken: this.tokenService.createAccessTokenFromUser(auth.user),
            isNewUser: true,
        };
    }

    private async getAuth(oAuthId: string, oAuth: AuthEntity['oAuth']) {
        return await this.authRepository.findOne({
            where: {
                oAuthId,
                oAuth,
            },
            relations: ['user', 'user.permissions'],
        });
    }

    private async createAuth(data: Parameters<typeof AuthEntity.create>[0]) {
        const auth = AuthEntity.create(data);
        return await this.authRepository.save(auth);
    }
}
