import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { MeetService } from './meet.service';
import { Auth } from '../auth/decorator/auth.decorator';
import { AccessTokenPayload } from '../auth/types/accessTokenPayload';
import { Token } from '../auth/decorator/token.decorator';
import { PostMeetReqDto } from './dto/PostMeet.req.dto';
import { GetMeetsReqDto } from './dto/GetMeets.req.dto';
import { PatchMeetReqDto } from './dto/PatchMeet.req.dto';
import {
    GetMeetRes,
    GetMeetsRes,
    PatchMeetRes,
    PostMeetRes,
} from 'moyeo-object';

@Controller('meets')
export class MeetController {
    constructor(private readonly meetService: MeetService) {}

    @Auth()
    @Get('/')
    async getMeets(
        @Token() token: AccessTokenPayload,
        @Query() query?: GetMeetsReqDto,
    ): Promise<GetMeetsRes> {
        if (!query || query.creatorType === 'user') {
            const meets = await this.meetService.getMeets(token.userId, {
                status: query?.status,
            });
            return {
                meets,
            };
        }

        if (query.creatorType === 'group') {
            const meets = await this.meetService.getMeetsByGroupId(
                query.creatorId,
                {
                    status: query?.status,
                },
            );
            return {
                meets,
            };
        }

        const meets = await this.meetService.getMeets(token.userId, {
            status: query?.status,
        });
        return {
            meets,
        };
    }

    @Get('/:meetId')
    async getMeet(@Param('meetId') meetId: string): Promise<GetMeetRes> {
        const meet = await this.meetService.getMeet(+meetId);
        return {
            meet,
        };
    }

    @Auth()
    @Post('/')
    async postMeet(
        @Token() token: AccessTokenPayload,
        @Body() dto: PostMeetReqDto,
    ): Promise<PostMeetRes> {
        const meetObj = await this.meetService.postMeet(token.userId, dto);
        return {
            meet: meetObj,
        };
    }

    @Auth()
    @Patch('/:meetId')
    async patchMeet(
        @Token() token: AccessTokenPayload,
        @Param('meetId') meetId: string,
        @Body() dto: PatchMeetReqDto,
    ): Promise<PatchMeetRes> {
        const isUserMember = await this.meetService.isUserMember(
            token.userId,
            +meetId,
        );
        if (!isUserMember) {
            throw new BadRequestException({
                code: 'NOT_MEMBER',
                message: '해당 모임의 멤버가 아닙니다.',
            });
        }
        const meetObj = await this.meetService.patchMeet(+meetId, dto);
        return {
            meet: meetObj,
        };
    }

    @Auth()
    @Delete('/:meetId')
    async deleteMeet(
        @Token() token: AccessTokenPayload,
        @Param('meetId') meetId: string,
    ) {
        const isUserMember = await this.meetService.isUserMember(
            token.userId,
            +meetId,
        );
        if (!isUserMember) {
            throw new BadRequestException({
                code: 'NOT_MEMBER',
                message: '해당 모임의 멤버가 아닙니다.',
            });
        }
        await this.meetService.deleteMeet(+meetId);
    }
}
