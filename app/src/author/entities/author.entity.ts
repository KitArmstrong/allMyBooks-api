import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthorRO } from '../ro/author.ro';

@Entity('author')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255,
  })
  first_name: string;

  @Column('varchar', {
    length: 255,
  })
  last_name: string;

  @Column('int')
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toResponseObject(): AuthorRO {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      created_by: this.created_by,
    };
  }
}
