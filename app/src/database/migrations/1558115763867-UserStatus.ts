import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserStatus1558115763867 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner
      .manager
      .query(`
        INSERT INTO "user_status" (id, name)
        VALUES
          (
            1,
            'Active'
          ),
          (
            2,
            'Inactive'
          ),
          (
            3,
            'Pending'
          ),
          (
            4,
            'Blocked'
          );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.query(`DELETE FROM "user_status";`);
  }

}
