import { AuthorEntity } from 'src/author/entities/author.entity';
import { BookGenreEntity } from 'src/book/entities/book-genre.entity';

export class BookRO {
  id: number;
  title: string;
  author: AuthorEntity;
  genre: BookGenreEntity;
}
