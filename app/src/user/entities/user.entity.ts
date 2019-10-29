import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserRO } from '../ro/user.ro';

@Entity('app_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  user_status_id: number;

  @Column('int')
  user_type_id: number;

  @Column('varchar', {
    length: 255
  })
  first_name: string;

  @Column('varchar', {
    length: 255,
  })
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
      user_status_id: this.user_status_id,
      user_type_id: this.user_type_id,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
