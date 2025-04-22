import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1745322600302 implements MigrationInterface {
    name = 'FirstMigration1745322600302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer, "isFed" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_b75c4e5c0bc645d7d0b02258f8e" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cat"("id", "name", "breed", "ownerId") SELECT "id", "name", "breed", "ownerId" FROM "cat"`);
        await queryRunner.query(`DROP TABLE "cat"`);
        await queryRunner.query(`ALTER TABLE "temporary_cat" RENAME TO "cat"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cat" RENAME TO "temporary_cat"`);
        await queryRunner.query(`CREATE TABLE "cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer, CONSTRAINT "FK_b75c4e5c0bc645d7d0b02258f8e" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "cat"("id", "name", "breed", "ownerId") SELECT "id", "name", "breed", "ownerId" FROM "temporary_cat"`);
        await queryRunner.query(`DROP TABLE "temporary_cat"`);
    }

}
