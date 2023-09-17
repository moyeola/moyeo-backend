import * as AWS from 'aws-sdk';

import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostFileReqDto } from './dto/PostFile.req.dto';
import { PostFileRes } from 'moyeo-object';

@Controller('files')
export class FileController {
    constructor(private readonly fileService: FileService) {
        AWS.config.update({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
    }

    @Post('/')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fieldSize: 25 * 1024 * 1024,
            },
        }),
    )
    async upload(
        @Body() req: PostFileReqDto,
        @UploadedFile() file,
    ): Promise<PostFileRes> {
        const url = await this.fileService.uploadFile(req.category, file);
        return {
            url: url,
        };
    }
}
