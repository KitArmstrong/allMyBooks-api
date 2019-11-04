import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthorEntity } from 'src/author/entities/author.entity';
import { AuthorRO } from 'src/author/ro/author.ro';
import { SuccessRO } from 'src/common/ro/success.ro';
import { AuthorCreateDTO } from 'src/author/dto/author.create.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) { }

  /**
   * Finds all authors created by a user.
   *
   * @param userId User's ID
   * @returns An array of authors
   */
  async findAllAuthors(userId: number): Promise<AuthorRO[]> {
    const authors = await this.authorRepository.find({ created_by: userId });
    return authors.map(author => author.toResponseObject());
  }

  /**
   * Finds a single author created by a user.
   *
   * @param id Author ID
   * @param userId User ID
   * @returns An author
   */
  async findById(id: number, userId: number): Promise<AuthorRO> {
    const author = await this.authorRepository.findOne({ id, created_by: userId });
    return author.toResponseObject();
  }

  /**
   * Creates a new author.
   *
   * @param data New author request
   * @param userId User ID
   * @returns New author object
   */
  async create(data: AuthorCreateDTO, userId: number): Promise<AuthorEntity> {
    const author = this.authorRepository.create({ ...data, created_by: userId });
    return await this.authorRepository.save(author);
  }

  /**
   * Deletes an author
   *
   * @param id Author ID
   * @param userId User ID
   * @returns Success indication
   */
  async delete(id: number, userId: number): Promise<SuccessRO> {
    this.authorRepository.delete({ id, created_by: userId });
    return { success: true };
  }
}
