import { Test, TestingModule } from '@nestjs/testing';
import { loadEntityFactories, loadSeeds, setConnection } from 'typeorm-seeding';

import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';

/**
 * WARNING: THIS SCRIPT NEEDS TO BE TRANSPILED IN ORDER TO RUN!
 *
 * Clear the database excluding certain tables.
 */
const clear = async () => {
  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const db = module.get<DatabaseService>(DatabaseService);
  console.log('Connection: ', db.connection.options);

  await loadEntityFactories('dist/database/factories');
  await loadSeeds('dist/database/seeds');
  setConnection(db.connection);

  try {
    const entities = db.connection.entityMetadatas;
    const blacklist = [
      'user_status',
      'user_type',
    ];
    for (const entity of entities) {
      if (!blacklist.includes(entity.tableName)) {
        console.log(`Clearing table: ${entity.tableName}`);
        const repository = await db.connection.getRepository(entity.name);
        await repository.query(`DELETE FROM "${entity.tableName}";`);
      }
    }
  } catch (err) {
    throw new Error(`ERROR: Cleaning db: ${err}`);
  }
};

clear();
