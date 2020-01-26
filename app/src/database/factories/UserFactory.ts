import { define } from 'typeorm-seeding';
import * as Faker from 'faker';

import { UserEntity } from 'src/user/entities/user.entity';

define(UserEntity, (faker: typeof Faker, settings) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  const password = 'password';

  const user = new UserEntity();
  user.first_name = firstName;
  user.last_name = lastName;
  user.email = email;
  user.password = password;
  // user.user_status_id = 1;
  // user.user_type_id = 1;

  return user;
});
