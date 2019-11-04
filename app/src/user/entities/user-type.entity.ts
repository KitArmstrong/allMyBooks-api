import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';

@Entity('user_type')
export class UserTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 64 })
  name: string;

  @OneToMany(type => UserEntity, user => user.user_type)
  users: UserEntity[];
}
