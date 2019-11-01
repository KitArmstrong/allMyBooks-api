import { Controller, UseGuards, Req, Body, Param, Post, Get, Delete } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { AuthorService } from 'src/author/author.service';
import { AuthorRO } from 'src/author/ro/author.ro';
import { SuccessRO } from 'src/common/ro/success.ro';
import { AuthorCreateDTO } from 'src/author/dto/author.create.dto';

@ApiBearerAuth()
@ApiUseTags('authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @UseGuards(JWTGuard)
  findAll(@Req() req: Request): Promise<AuthorRO[]> {
    return this.authorService.findAllAuthors((req as any).user.id);
  }

  @Get('/:id')
  @UseGuards(JWTGuard)
  findById(@Req() req: Request, @Param('id') author_id: number) {
    return this.authorService.findById(author_id, (req as any).user.id);
  }

  @Post()
  @UseGuards(JWTGuard)
  create(@Req() req: Request, @Body() data: AuthorCreateDTO): Promise<AuthorEntity> {
    return this.authorService.create(data, (req as any).user.id);
  }

  @Delete('/:id')
  @UseGuards(JWTGuard)
  delete(@Req() req: Request, @Param('id') author_id: number): Promise<SuccessRO> {
    return this.authorService.delete(author_id, (req as any).user.id);
  }
}
