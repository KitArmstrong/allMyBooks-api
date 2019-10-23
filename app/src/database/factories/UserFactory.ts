import { define } from 'typeorm-seeding';
import * as Faker from 'faker';

import { UserEntity } from 'src/user/entities/user.entity';

define(UserEntity, (faker: typeof Faker, settings) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);
  const password = 'password';

  const user = new UserEntity();
  user.first_name = firstName;
  user.last_name = lastName;
  user.email = email;
  user.password = password;
  user.user_status_id = 1;
  user.user_type_id = 1;

  return user;
});
