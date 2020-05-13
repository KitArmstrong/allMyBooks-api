import { Injectable } from '@nestjs/common';

import { SuccessRO } from './common/ro/success.ro';

@Injectable()
export class AppService {
  getHealthCheck(): SuccessRO {
    return { success: true };
  }
}
