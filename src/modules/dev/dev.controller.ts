import { Controller, Get } from '@nestjs/common';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Get()
  getDev() {
    return {
      message: 'Hello World!',
    };
  }
}
