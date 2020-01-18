import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTypeEntity } from 'src/user/entities/user-type.entity';
import { UserStatusEntity } from 'src/user/entities/user-status.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeEntity, UserStatusEntity]), UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
