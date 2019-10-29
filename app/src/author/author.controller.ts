import { Controller, UseGuards, Req, Body, Post, Get } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { AuthorService } from './author.service';
import { AuthorRO } from './ro/author.ro';
import { AuthorCreateDTO } from './dto/author.create.dto';

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

  @Post()
  @UseGuards(JWTGuard)
  create(@Req() req: Request, @Body() data: AuthorCreateDTO): Promise<AuthorEntity> {
    return this.authorService.create(data, (req as any).user.id);
  }
}
