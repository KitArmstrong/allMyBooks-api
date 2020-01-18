import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookEntity } from 'src/book/entities/book.entity';
import { BookGenreEntity } from 'src/book/entities/book-genre.entity';
import { BookRO } from 'src/book/ro/book.ro';
import { SuccessRO } from 'src/common/ro/success.ro';
import { BookCreateDTO } from 'src/book/dto/book.create.dto';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { handleError } from 'src/utils/error';

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

  /**
   * Finds all books created by a user.
   *
   * @param userId User ID
   * @returns An array of books
   */
  async findAllBooks(userId: number): Promise<BookRO[]> {
    try {
      const books = await this.bookRepository.find({ created_by: userId });
      return books.map((book) => book.toResponseObject());
    } catch (error) {
      handleError('Error finding books', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Finds a book created by a user.
   *
   * @param id Book ID
   * @param user_id User ID
   * @returns A book object
   */
  async findById(id: number, user_id: number): Promise<BookRO> {
    try {
      const book = await this.bookRepository.findOne({ id, created_by: user_id }, { relations: ['author', 'genre'] });
      return book.toResponseObject();
    } catch (error) {
      handleError('Error finding book', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Creates a new book object for a user. Confirms that the author
   * and genre are valid before creation.
   *
   * @param data New book request
   * @param userId User ID
   * @returns A book object
   */
  async create(data: BookCreateDTO, userId: number): Promise<BookEntity> {
    const { genre_id, author_id, title } = data;

    try {
      // Confirm the genre exists.
      const genre = await this.bookGenreRepository.findOne({ id: genre_id });

      if (!genre) {
        handleError('Error creating book - invalid genre', HttpStatus.BAD_REQUEST);
      }

      // Confirm the author exists.
      const author = await this.authorRepository.findOne({ id: author_id });

      if (!author) {
        handleError('Error creating book - invalid author', HttpStatus.BAD_REQUEST);
      }

      const newBook = {
        title,
        created_by: userId,
        author,
        genre,
      };

      const book = this.bookRepository.create(newBook);
      return await this.bookRepository.save(book);
    } catch (error) {
      handleError('Error creating book', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes a book.
   *
   * @param id Book ID
   * @param userId User ID
   * @returns Succes indication
   */
  async delete(id: number, userId: number): Promise<SuccessRO> {
    try {
      this.bookRepository.delete({ id, created_by: userId });
      return { success: true };
    } catch (error) {
      handleError('Error deleting book', HttpStatus.BAD_REQUEST);
    }
  }
}
