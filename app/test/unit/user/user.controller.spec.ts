import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

const userServiceMock = {
  showAll: () => [{}],
  findByEmail: () => {},
  findById: () => {},
  create: () => {},
};

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(userServiceMock)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
