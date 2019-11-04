import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserRO } from 'src/user/ro/user.ro';
import { UserStatusEntity } from 'src/user/entities/user-status.entity';
import { UserTypeEntity } from 'src/user/entities/user-type.entity';

@Entity('app_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => UserStatusEntity, userStatus => userStatus.users)
  user_status: UserStatusEntity;

  @ManyToOne(type => UserTypeEntity, (userType) => userType.users)
  user_type: UserTypeEntity;

  @Column('varchar', { length: 255 })
  first_name: string;

  @Column('varchar', { length: 255 })
  last_name: string;

  @Column('varchar', {
    length: 255,
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  toResponseObject(): UserRO {
    return {
      id: this.id,
      user_status: this.user_status,
      user_type: this.user_type,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
