import { Test, TestingModule } from '@nestjs/testing';
import { loadEntityFactories, loadSeeds, setConnection, runSeed } from 'typeorm-seeding';
import * as faker from 'faker';

import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUser } from 'src/database/seeds/CreateUser';
import { UserType1558115068492 } from 'src/database/migrations/1558115068492-UserType';

/**
 * WARNING: THIS SCRIPT NEEDS TO BE TRANSPILED IN ORDER TO RUN!
 *
 * Seeds the database with dummy data for testing purposes.
 */
const seed = async () => {
  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const db = module.get<DatabaseService>(DatabaseService);
  const em = db.connection.manager;
  console.log('Connection: ', db.connection.options);

  await loadEntityFactories('dist/database/factories');
  await loadSeeds('dist/database/seeds');
  setConnection(db.connection);

  try {
    console.log('Seeding default users ...');

    const userOne = await runSeed<UserEntity>(CreateUser);
    userOne.first_name = 'Admin';
    userOne.last_name  = 'User';
    userOne.email      = 'admin@example.com';
    userOne.user_type.id = 1;
    userOne.user_status.id = 1;
    await em.save(userOne);

  } catch (err) {
    throw new Error(`ERROR: Seeding db: ${err}`);
  }
}

seed();
