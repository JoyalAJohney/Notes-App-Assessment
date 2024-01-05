import { MigrationInterface, QueryRunner } from 'typeorm';

export class SearchIndex1704445860796 implements MigrationInterface {
  name = 'SearchIndex1704445860796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "searchTerm" tsvector 
       GENERATED ALWAYS AS (setweight(to_tsvector('simple', coalesce("header",'')), 'A') || setweight(to_tsvector('simple', coalesce("content",'')), 'B')) STORED`,
    );

    await queryRunner.query(
      `CREATE INDEX searchVector_idx ON notes USING GIN ("searchTerm");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "searchTerm"`);
  }
}
