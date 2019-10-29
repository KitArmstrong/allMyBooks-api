import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('book_genre')
export class BookGenreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 64,
  })
  name: string;
}
