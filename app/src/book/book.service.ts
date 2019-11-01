import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookEntity } from 'src/book/entities/book.entity';
import { BookGenreEntity } from 'src/book/entities/book-genre.entity';
import { BookRO } from 'src/book/ro/book.ro';
import { BookCreateDTO } from 'src/book/dto/book.create.dto';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { SuccessRO } from 'src/common/ro/success.ro';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
    @InjectRepository(BookGenreEntity)
    private bookGenreRepository: Repository<BookGenreEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) { }

  async findAllBooks(userId: number): Promise<BookRO[]> {
    const books = await this.bookRepository.find({ created_by: userId });
    return books.map((book) => book.toResponseObject());
  }

  async findById(id: number, user_id: number): Promise<BookRO> {
    const book = await this.bookRepository.findOne({ id, created_by: user_id }, { relations: ['author', 'genre'] });
    return book.toResponseObject();
  }

  async create(data: BookCreateDTO, userId: number): Promise<BookEntity> {
    const { genre_id, author_id, title } = data;

    // Confirm the genre exists.
    const genre = await this.bookGenreRepository.findOne({ id: genre_id });

    if (!genre) {
      throw new HttpException(`Genre not found.`, HttpStatus.BAD_REQUEST);
    }

    // Confirm the author exists.
    const author = await this.authorRepository.findOne({ id: author_id });

    if (!author) {
      throw new HttpException('Author not found', HttpStatus.BAD_REQUEST);
    }

    const newBook = {
      title,
      created_by: userId,
      author,
      genre,
    };

    const book = this.bookRepository.create(newBook);
    return await this.bookRepository.save(book);
  }

  async delete(id: number, userId: number): Promise<SuccessRO> {
    this.bookRepository.delete({ id, created_by: userId });
    return { success: true };
  }
}
