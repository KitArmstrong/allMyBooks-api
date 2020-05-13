import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { AuthLoginDTO } from 'src/auth/dto/auth-login.dto';
import { AuthRegisterDTO } from 'src/auth/dto/auth-register.dto';
import { AuthLoginRO } from 'src/auth/ro/auth-login.ro';
import { UserRO } from 'src/user/ro/user.ro';
import { UserTypeEntity } from 'src/user/entities/user-type.entity';
import { UserStatusEntity } from 'src/user/entities/user-status.entity';
import { UserService } from 'src/user/user.service';
import { handleError } from 'src/utils/error';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserTypeEntity)
    private userTypeRepository: Repository<UserTypeEntity>,
    @InjectRepository(UserTypeEntity)
    private userStatusRepository: Repository<UserStatusEntity>,
    private readonly userService: UserService,
  ) { }

  /**
   * Validates a user and returns a signed JWT.
   *
   * @param data Login request
   * @returns Signed JWT
   */
  async login(data: AuthLoginDTO): Promise<AuthLoginRO> {
    try {
      const user = await this.validate(data);

      if (user) {
        const accessToken = jwt.sign(
          {
            id: user.id,
            user_status_id: user.user_status.id,
            user_type_id: user.user_type.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' },
        );

        const ret: AuthLoginRO = { access_token: accessToken };
        return ret;
      } else {
        handleError('Invalid Login', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      handleError('Invalid Login', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Registers a new user.
   *
   * @param data User registration request
   * @returns New user object
   */
  async register(data: AuthRegisterDTO): Promise<UserRO> {
    try {
      // Confirm the status and type are valid.
      const userType = await this.userTypeRepository.findOne(data.user_type_id);

      if (!userType) {
        handleError('Error creating user - invalid user type', HttpStatus.BAD_REQUEST);
      }

      const userStatus = await this.userStatusRepository.findOne(data.user_status_id);

      if (!userStatus) {
        handleError('Error creating user - invalid user status', HttpStatus.BAD_REQUEST);
      }

      const validatedData = {
        ...data,
        user_type: userType,
        user_status: userStatus,
      };

      const user = await this.userService.create(validatedData);
      return user.toResponseObject();
    } catch (error) {
      handleError('Error creating user', HttpStatus.BAD_REQUEST);
    }
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
