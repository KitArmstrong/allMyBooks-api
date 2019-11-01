import { Connection } from 'typeorm';
import { Factory, Seed } from 'typeorm-seeding';

import { UserEntity } from 'src/user/entities/user.entity';

export class CreateUser implements Seed {

  public async seed(factory: Factory, connection: Connection): Promise<UserEntity> {
    return await factory(UserEntity)().seed();
  }

}
