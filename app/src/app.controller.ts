import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { SuccessRO } from './common/ro/success.ro';

@ApiUseTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('healthcheck')
  healthCheck(): SuccessRO {
    return this.appService.getHealthCheck();
  }
}
