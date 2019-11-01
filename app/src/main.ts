import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { documentation } from './common/common.documentation';

const port = 4000;

async function bootstrap() {
  // Setup app and necessary configuration
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Add Validation pipe and whitelisting
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Document application using Swagger
  documentation(app);

  // Listen on specified port
  await app.listen(port);

  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
