import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { DevService } from './dev.service';
import { DevOnlyGuard } from './dev.guard';
import { PostAccessTokenReqDto } from './dto/PostAccessToken.req.dto';
import { PostDevAuthReqDto } from './dto/PostDevAuth.req.dto';
import { DevAuthService } from './dev.auth.service';
import {
    PostDevAccessTokenRes,
    PostDevAuthRes,
    PostDevUserRes,
} from 'moyeo-object';

@Controller('dev')
export class DevController {
    constructor(
        private readonly devService: DevService,
        private readonly devAuthService: DevAuthService,
    ) {}

    @Get()
    getDev() {
        return {
            message: 'Hello World!',
        };
    }

    @Post('auth')
    async auth(@Body() dto: PostDevAuthReqDto): Promise<PostDevAuthRes> {
        if (dto.masterToken === process.env.DEV_MASTER_TOKEN) {
            const devToken = this.devAuthService.createDevToken(
                dto.developerName,
            );
            return {
                devToken,
            };
        } else {
            throw new BadRequestException({
                code: 'wrong_token',
            });
        }
    }

    @Post('access-token')
    @UseGuards(DevOnlyGuard)
    async accessToken(
        @Body() dto: PostAccessTokenReqDto,
    ): Promise<PostDevAccessTokenRes> {
        return {
            accessToken: this.devService.createAccessToken(
                dto.userId,
                dto.permissions,
            ),
        };
    }

    @Post('user')
    @UseGuards(DevOnlyGuard)
    createUser(
        @Body()
        dto: {
            name: string;
            profileImageUrl: string;
            email: string;
            oAuth: string;
            oAuthId: string;
        },
    ): Promise<PostDevUserRes> {
        return this.devService.createUser(dto);
    }
}
