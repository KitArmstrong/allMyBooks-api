import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookRO } from '../ro/book.ro';

@Entity('book')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255,
  })
  title: string;

  @Column('varchar', {
    length: 255,
  })
  author_id: number;

  @Column('varchar', {
    length: 255,
    unique: true,
  })
  genre_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toResponseObject(): BookRO {
    return {
      id: this.id,
      title: this.title,
      genre_id: this.genre_id,
      author_id: this.author_id,
    };
  }
}
