import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookEntity } from './entities/book.entity';
import { BookRO } from './ro/book.ro';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>
  ) {}

  async findAllBooks(): Promise<BookRO[]> {
    const books = await this.bookRepository.find();
    return books.map((book) => book.toResponseObject());
  }

  async findById(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOne({ id });
    return book;
  }

  async create(data: Partial<BookEntity>): Promise<BookEntity> {
    const book = await this.bookRepository.create(data);
    return await this.bookRepository.save(book);
  }

  async delete(id: number): Promise<any> {
    return await this.bookRepository.delete(id);
  }
}
