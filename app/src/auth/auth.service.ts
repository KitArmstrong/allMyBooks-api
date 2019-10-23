import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthLoginRO } from './ro/auth-login.ro';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRO } from 'src/user/ro/user.ro';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async login(data: AuthLoginDTO): Promise<AuthLoginRO> {
    const user = await this.validate(data);
    if (user) {
      const accessToken = jwt.sign(
        {
          id: user.id,
          user_status_id: user.user_status_id,
          user_type_id: user.user_type_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
      );

      const ret: AuthLoginRO = { access_token: accessToken };
      return ret;
    }
  }

  async register(data: AuthRegisterDTO): Promise<UserRO> {
    const user = await this.userService.create(data);
    return user.toResponseObject();
  }

  private async validate(data: AuthLoginDTO): Promise<UserRO> {
    const user: UserEntity = await this.userService.findByEmail(data.email);
    if (user && await user.comparePassword(data.password)) {
      return user.toResponseObject();
    }
  }
}
