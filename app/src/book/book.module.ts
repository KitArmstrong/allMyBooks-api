import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookController } from 'src/book/book.controller';
import { BookService } from 'src/book/book.service';
import { BookEntity } from 'src/book/entities/book.entity';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { BookGenreEntity } from 'src/book/entities/book-genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, AuthorEntity, BookGenreEntity])],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule { }
