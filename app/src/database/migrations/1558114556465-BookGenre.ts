import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookGenre1558114556465 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner
      .manager
      .query(`
        INSERT INTO "book_genre" (id, name)
        VALUES
          (
            1,
            'Mystery'
          ),
          (
            2,
            'Crime'
          ),
          (
            3,
            'Thriller'
          ),
          (
            4,
            'Comedy'
          ),
          (
            5,
            'Romance'
          );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.query(`DELETE FROM "book_genre";`);
  }

}
