import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { setupEnvironment, clearDB, closeDB, createTestUser, createTestToken } from '../util/testUtils';
import { DatabaseService } from 'src/database/database.service';
import { UserStatusEnum } from 'src/user/enums/user-status.enum';
import { UserTypeEnum } from 'src/user/enums/user-type.enum';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let user;
  let auth;

  beforeAll(async () => {
    ({ app, db } = await setupEnvironment());
  }, 30000);

  beforeEach(async () => {
    await clearDB(db.connection);
    user = await createTestUser(db.connection, UserTypeEnum.STANDARD, UserStatusEnum.ACTIVE);
    auth = createTestToken(user);
  }, 30000);

  afterAll(async () => {
    await clearDB(db.connection);
    await closeDB(db.connection);
    await app.close();
  });

  it('/users (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${auth.access_token}`)
      .expect(200)
      .then((res) => {
        expect(true).toBeTruthy();
      });
  });

  it('/users (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer`)
      .expect(403)
      .then((res) => {
        expect(true).toBeTruthy();
      });
  });
});
