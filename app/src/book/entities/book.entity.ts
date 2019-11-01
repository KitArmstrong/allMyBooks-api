import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookRO } from '../ro/book.ro';
import { AuthorEntity } from '../../author/entities/author.entity';
import { BookGenreEntity } from './book-genre.entity';

@Entity('book')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('int')
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(type => AuthorEntity, author => author.books)
  author: AuthorEntity;

  @ManyToOne(type => BookGenreEntity, genre => genre.books)
  genre: BookGenreEntity;

  toResponseObject(): BookRO {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      genre: this.genre,
    };
  }
}
