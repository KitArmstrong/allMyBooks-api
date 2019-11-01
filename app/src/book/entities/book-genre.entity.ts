import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { BookEntity } from './book.entity';

@Entity('book_genre')
export class BookGenreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 64 })
  name: string;

  @OneToMany(type => BookEntity, book => book.author)
  books: BookEntity[];
}
