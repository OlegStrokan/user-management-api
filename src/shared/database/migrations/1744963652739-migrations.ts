import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744963652739 implements MigrationInterface {
  name = 'Migrations1744963652739';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "roles" text array NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "groups"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "groups" text array NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "groups"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "groups" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "roles" text NOT NULL`);
  }
}
