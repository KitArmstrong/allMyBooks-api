import { Controller, UseGuards, Req, Body, Param, Get, Post, Delete } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { BookEntity } from 'src/book/entities/book.entity';
import { BookService } from 'src/book/book.service';
import { BookRO } from 'src/book/ro/book.ro';
import { SuccessRO } from 'src/common/ro/success.ro';
import { BookCreateDTO } from 'src/book/dto/book.create.dto';

@ApiBearerAuth()
@ApiUseTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Get()
  @UseGuards(JWTGuard)
  findAll(@Req() req: Request): Promise<BookRO[]> {
    return this.bookService.findAllBooks((req as any).user.id);
  }

  @Get('/:id')
  @UseGuards(JWTGuard)
  findById(@Req() req: Request, @Param('id') book_id: number) {
    return this.bookService.findById(book_id, (req as any).user.id);
  }

  @Post()
  @UseGuards(JWTGuard)
  create(@Req() req: Request, @Body() data: BookCreateDTO): Promise<BookEntity> {
    return this.bookService.create(data, (req as any).user.id);
  }

  @Delete('/:id')
  @UseGuards(JWTGuard)
  delete(@Req() req: Request, @Param('id') book_id: number): Promise<SuccessRO> {
    return this.bookService.delete(book_id, (req as any).user.id);
  }
}
