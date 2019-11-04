import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { AuthLoginDTO } from 'src/auth/dto/auth-login.dto';
import { AuthRegisterDTO } from 'src/auth/dto/auth-register.dto';
import { AuthLoginRO } from 'src/auth/ro/auth-login.ro';
import { UserRO } from 'src/user/ro/user.ro';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  /**
   * Validates a user and returns a signed JWT.
   *
   * @param data Login request
   * @returns Signed JWT
   */
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

  /**
   * Registers a new users.
   *
   * @param data User registration request
   * @returns New user object
   */
  async register(data: AuthRegisterDTO): Promise<UserRO> {
    const user = await this.userService.create(data);
    return user.toResponseObject();
  }

  /**
   * Validates a user email and password are correct.
   *
   * @param data Login request
   * @returns User object
   */
  private async validate(data: AuthLoginDTO): Promise<UserRO> {
    const user = await this.userService.findByEmail(data.email);
    if (user && await user.comparePassword(data.password)) {
      return user.toResponseObject();
    }
  }
}
