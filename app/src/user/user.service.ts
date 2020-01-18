import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { handleError } from 'src/utils/error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ email }, { relations: ['user_status', 'user_type']});
      return user;
    } catch (error) {
      // Leave a generic error in case this is ever exposed. Do not
      // want to expose that email couldn't be found.
      handleError('Error', HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ id }, { relations: ['user_status', 'user_type'] });
      return user;
    } catch (error) {
      // Leave a generic error in case this is ever exposed. Do not
      // want to expose that email couldn't be found.
      handleError('Error', HttpStatus.BAD_REQUEST);
    }
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(data);
      return await this.userRepository.save(user);
    } catch (error) {
      handleError('Error creating user', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: number): Promise<any> {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      handleError('Error deleting user', HttpStatus.BAD_REQUEST);
    }
  }
}
