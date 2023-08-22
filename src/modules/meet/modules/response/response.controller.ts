import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { MeetResponseService } from './response.service';
import { Auth } from '@/modules/auth/decorator/auth.decorator';
import { Token } from '@/modules/auth/decorator/token.decorator';
import { AccessTokenPayload } from '@/modules/auth/types/accessTokenPayload';
import { PostMeetResponseReqDto } from './dto/PostMeetResponse.req.dto';

@Controller('meets/:meetId/responses')
export class MeetResponseController {
    constructor(private readonly meetResponseService: MeetResponseService) {}

    @Get('/:responseId')
    async getMeetResponse(
        @Param('meetId') meetId: string,
        @Param('responseId') responseId: string,
    ) {
        const meetResponse = await this.meetResponseService.getMeetResponse(
            +meetId,
            +responseId,
        );
        return {
            meetResponse,
        };
    }

    @Auth()
    @Post('/')
    async postMeetResponse(
        @Token() token: AccessTokenPayload,
        @Param('meetId') meetId: string,
        @Body() dto: PostMeetResponseReqDto,
    ) {
        await this.meetResponseService.postMeetResponse(
            +meetId,
            token.userId,
            dto,
        );
    }

    @Auth()
    @Patch('/:responseId')
    async patchMeetResponse(
        @Token() token: AccessTokenPayload,
        @Param('meetId') meetId: string,
        @Body() dto: PostMeetResponseReqDto,
    ) {
        await this.meetResponseService.patchMeetResponse(
            +meetId,
            token.userId,
            dto,
        );
    }

    @Auth()
    @Delete('/:responseId')
    async deleteMeetResponse(
        @Token() token: AccessTokenPayload,
        @Param('meetId') meetId: string,
    ) {
        await this.meetResponseService.deleteMeetResponse(
            +meetId,
            token.userId,
        );
    }
}
