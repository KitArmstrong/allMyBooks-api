import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { BookService } from './book.service';
import { BookRO } from './ro/book.ro';

@ApiBearerAuth()
@ApiUseTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @UseGuards(new JWTGuard())
  findAll(): Promise<BookRO[]> {
    return this.bookService.findAllBooks();
  }
}
