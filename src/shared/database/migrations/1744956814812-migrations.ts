import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744956814812 implements MigrationInterface {
  name = 'Migrations1744956814812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying(26) NOT NULL, "name" character varying(100) NOT NULL, "roles" text NOT NULL, "groups" text NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
