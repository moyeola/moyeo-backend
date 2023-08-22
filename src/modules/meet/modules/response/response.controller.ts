import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MeetResponseService } from './response.service';
import { Auth } from '@/modules/auth/decorator/auth.decorator';
import { Token } from '@/modules/auth/decorator/token.decorator';
import { AccessTokenPayload } from '@/modules/auth/types/accessTokenPayload';
import { PostMeetResponseReqDto } from './dto/PostMeetResponse.req.dto';

@Controller('meets/:meetId/responses')
export class MeetResponseController {
    constructor(private readonly meetResponseService: MeetResponseService) {}

    @Get('/:responseId')
    async getMeetResponse() {
        return {
            meetResponse: {},
        };
    }

    @Auth()
    @Post('/')
    async postMeetResponse(
        @Token() token: AccessTokenPayload,
        @Query('meetId') meetId: string,
        @Body() dto: PostMeetResponseReqDto,
    ) {
        await this.meetResponseService.postMeetResponse(
            +meetId,
            token.userId,
            dto,
        );
    }

    @Auth()
    @Post('/:responseId')
    async patchMeetResponse(
        @Token() token: AccessTokenPayload,
        @Query('meetId') meetId: string,
        @Body() dto: PostMeetResponseReqDto,
    ) {
        await this.meetResponseService.patchMeetResponse(
            +meetId,
            token.userId,
            dto,
        );
    }
}
