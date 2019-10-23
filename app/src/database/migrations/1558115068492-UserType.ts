import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserType1558115068492 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner
      .manager
      .query(`
        INSERT INTO "user_type" (id, name)
        VALUES
          (
            1,
            'System Administrator'
          ),
          (
            2,
            'Standard'
          );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.query(`DELETE FROM "user_type";`);
  }

}
