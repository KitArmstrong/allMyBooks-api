import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';
import { UserRO } from './ro/user.ro';

@ApiBearerAuth()
@ApiUseTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

}
