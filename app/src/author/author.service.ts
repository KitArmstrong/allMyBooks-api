import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthorEntity } from 'src/author/entities/author.entity';
import { AuthorRO } from 'src/author/ro/author.ro';
import { SuccessRO } from 'src/common/ro/success.ro';
import { AuthorCreateDTO } from 'src/author/dto/author.create.dto';
import { handleError } from 'src/utils/error';

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
    try {
      const authors = await this.authorRepository.find({ created_by: userId });
      return authors.map(author => author.toResponseObject());
    } catch (error) {
      handleError('Error finding authors', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Finds a single author created by a user.
   *
   * @param id Author ID
   * @param userId User ID
   * @returns An author
   */
  async findById(id: number, userId: number): Promise<AuthorRO> {
    try {
      const author = await this.authorRepository.findOne({ id, created_by: userId });
      return author.toResponseObject();
    } catch (error) {
      handleError('Error finding author', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Creates a new author.
   *
   * @param data New author request
   * @param userId User ID
   * @returns New author object
   */
  async create(data: AuthorCreateDTO, userId: number): Promise<AuthorEntity> {
    try {
      const author = this.authorRepository.create({ ...data, created_by: userId });
      return await this.authorRepository.save(author);
    } catch (error) {
      handleError('Error creating author', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes an author
   *
   * @param id Author ID
   * @param userId User ID
   * @returns Success indication
   */
  async delete(id: number, userId: number): Promise<SuccessRO> {
    try {
      this.authorRepository.delete({ id, created_by: userId });
      return { success: true };
    } catch (error) {
      handleError('Error deleting author', HttpStatus.BAD_REQUEST);
    }
  }
}
