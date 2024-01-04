import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeTables1704352276762 implements MigrationInterface {
  name = 'InitializeTables1704352276762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "header" character varying, "content" character varying, "createdBy" uuid NOT NULL, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shared_notes" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "noteId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_3f61960ce7f7b13d4b59287247c" UNIQUE ("noteId", "userId"), CONSTRAINT "PK_be8ea323be231a57990ba78e75c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "shared_notes"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
