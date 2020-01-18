import { Controller, Post, Body } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthLoginRO } from './ro/auth-login.ro';
import { UserRO } from 'src/user/ro/user.ro';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() user: AuthLoginDTO): Promise<AuthLoginRO> {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() user: AuthRegisterDTO): Promise<UserRO> {
    return this.authService.register(user);
  }
}
