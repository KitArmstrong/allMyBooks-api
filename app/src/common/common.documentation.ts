import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AppModule } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BookModule } from 'src/book/book.module';
import { AuthorModule } from 'src/author/author.module';
import { CONFIG } from './common.config';

export const documentation = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(CONFIG.general.title)
    .setDescription(CONFIG.general.description)
    .setVersion(CONFIG.version.major + '.' + CONFIG.version.minor)
    .addBearerAuth()
    .build();

  const baseDocument = SwaggerModule.createDocument(app, options, {
    include: [
      AppModule,
      AuthModule,
      UserModule,
      BookModule,
      AuthorModule,
    ],
  });

  SwaggerModule.setup('api', app, baseDocument);
};
