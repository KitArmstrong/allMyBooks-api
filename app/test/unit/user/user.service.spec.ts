import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from 'src/user/user.service';

describe('UserService', () => {
  let service: UserService;
  const mockService = {
    findAllUsers: () => [{}],
    findByEmail: () => {},
    findById: () => {},
    create: () => {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockService)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
