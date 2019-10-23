import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';

const migrate = async () => {
  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const db = module.get<DatabaseService>(DatabaseService);
  console.log('Connection: ', db.connection.options);

  try {
    console.log('Migrating database...');
    await db.connection.runMigrations();
  } catch (err) {
    throw new Error(`ERROR: migrating database: ${err}`);
  }
}

migrate();
