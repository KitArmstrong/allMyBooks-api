import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthorEntity } from './entities/author.entity';
import { AuthorRO } from './ro/author.ro';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) {}

  async findAllAuthors(userId: number): Promise<AuthorRO[]> {
    const authors = await this.authorRepository.find({ created_by: userId });
    return authors.map(author => author.toResponseObject());
  }

  async findById(id: number, userId: number): Promise<AuthorRO> {
    const author = await this.authorRepository.findOne({ id, created_by: userId });
    return author.toResponseObject();
  }

  async create(data: Partial<AuthorEntity>, userId: number): Promise<AuthorEntity> {
    const author = this.authorRepository.create({ ...data, created_by: userId });
    return await this.authorRepository.save(author);
  }

  // TODO: Handle the delete response.
  async delete(id: number, userId: number): Promise<any> {
    return await this.authorRepository.delete({ id, created_by: userId });
  }
}
