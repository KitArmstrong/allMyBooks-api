import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Connection } from 'typeorm';
import { loadEntityFactories, loadSeeds, setConnection, runSeed } from 'typeorm-seeding';
import * as jwt from 'jsonwebtoken';

import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthLoginRO } from 'src/auth/ro/auth-login.ro';
import { CreateUser } from 'src/database/seeds/CreateUser';
import { UserTypeEnum } from 'src/user/enums/user-type.enum';
import { UserStatusEnum } from 'src/user/enums/user-status.enum';

export const setupEnvironment = async (): Promise<{module: TestingModule, app: INestApplication, db: DatabaseService}> => {
  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication();
  const db = module.get<DatabaseService>(DatabaseService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.init();

  await loadEntityFactories('src/database/factories');
  await loadSeeds('src/database/seeds');
  setConnection(db.connection);

  return { module, app, db };
};

export const clearDB = async (connection: Connection): Promise<void> => {
  try {
    const entities = connection.entityMetadatas;
    const blacklist = [
      'user_status',
      'user_type',
    ];
    for (const entity of entities) {
      if (!blacklist.includes(entity.tableName)) {
        const repository = await connection.getRepository(entity.name);
        await repository.query(`DELETE FROM "${entity.tableName}";`);
      }
    }
  } catch (err) {
    throw new Error(`ERROR: Cleaning test db: ${err}`);
  }
};

export const closeDB = async (connection: Connection): Promise<void> => {
  if (connection.isConnected) {
    await connection.close();
  }
};

export const createTestToken = (user: UserEntity): AuthLoginRO => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      user_status_id: user.user_status.id,
      user_type_id: user.user_type.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );

  return { access_token: accessToken };
};

export const createTestUser = async (connection: Connection, type: UserTypeEnum, status: UserStatusEnum) => {
  const user = await runSeed<UserEntity>(CreateUser);
  user.user_type.id = type;
  user.user_status.id = status;
  return await connection.manager.save(user);
};
