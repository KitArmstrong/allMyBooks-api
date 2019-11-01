import { Connection } from 'typeorm';
import { loadEntityFactories, loadSeeds, setConnection } from 'typeorm-seeding';

export const setupSeeding = async (connection: Connection) => {
  const dir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  await loadEntityFactories(`${dir}/database/factories`);
  await loadSeeds(`${dir}/database/factories`);
  setConnection(connection);
};
