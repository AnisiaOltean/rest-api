import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedUnusedOwnerId1746902162051 implements MigrationInterface {
    name = 'RemovedUnusedOwnerId1746902162051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer NOT NULL, "lastFed" varchar, CONSTRAINT "FK_b75c4e5c0bc645d7d0b02258f8e" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cat"("id", "name", "breed", "ownerId", "lastFed") SELECT "id", "name", "breed", "ownerId", "lastFed" FROM "cat"`);
        await queryRunner.query(`DROP TABLE "cat"`);
        await queryRunner.query(`ALTER TABLE "temporary_cat" RENAME TO "cat"`);
        await queryRunner.query(`CREATE TABLE "temporary_cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer NOT NULL, "lastFed" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_cat"("id", "name", "breed", "ownerId", "lastFed") SELECT "id", "name", "breed", "ownerId", "lastFed" FROM "cat"`);
        await queryRunner.query(`DROP TABLE "cat"`);
        await queryRunner.query(`ALTER TABLE "temporary_cat" RENAME TO "cat"`);
        await queryRunner.query(`CREATE TABLE "temporary_cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer, "lastFed" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_cat"("id", "name", "breed", "ownerId", "lastFed") SELECT "id", "name", "breed", "ownerId", "lastFed" FROM "cat"`);
        await queryRunner.query(`DROP TABLE "cat"`);
        await queryRunner.query(`ALTER TABLE "temporary_cat" RENAME TO "cat"`);
        await queryRunner.query(`CREATE TABLE "temporary_cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer, "lastFed" varchar, CONSTRAINT "FK_b75c4e5c0bc645d7d0b02258f8e" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cat"("id", "name", "breed", "ownerId", "lastFed") SELECT "id", "name", "breed", "ownerId", "lastFed" FROM "cat"`);
        await queryRunner.query(`DROP TABLE "cat"`);
        await queryRunner.query(`ALTER TABLE "temporary_cat" RENAME TO "cat"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cat" RENAME TO "temporary_cat"`);
        await queryRunner.query(`CREATE TABLE "cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer, "lastFed" varchar)`);
        await queryRunner.query(`INSERT INTO "cat"("id", "name", "breed", "ownerId", "lastFed") SELECT "id", "name", "breed", "ownerId", "lastFed" FROM "temporary_cat"`);
        await queryRunner.query(`DROP TABLE "temporary_cat"`);
        await queryRunner.query(`ALTER TABLE "cat" RENAME TO "temporary_cat"`);
        await queryRunner.query(`CREATE TABLE "cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer NOT NULL, "lastFed" varchar)`);
        await queryRunner.query(`INSERT INTO "cat"("id", "name", "breed", "ownerId", "lastFed") SELECT "id", "name", "breed", "ownerId", "lastFed" FROM "temporary_cat"`);
        await queryRunner.query(`DROP TABLE "temporary_cat"`);
        await queryRunner.query(`ALTER TABLE "cat" RENAME TO "temporary_cat"`);
        await queryRunner.query(`CREATE TABLE "cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer NOT NULL, "lastFed" varchar, CONSTRAINT "FK_b75c4e5c0bc645d7d0b02258f8e" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "cat"("id", "name", "breed", "ownerId", "lastFed") SELECT "id", "name", "breed", "ownerId", "lastFed" FROM "temporary_cat"`);
        await queryRunner.query(`DROP TABLE "temporary_cat"`);
        await queryRunner.query(`ALTER TABLE "cat" RENAME TO "temporary_cat"`);
        await queryRunner.query(`CREATE TABLE "cat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "breed" varchar NOT NULL, "ownerId" integer NOT NULL, "lastFed" varchar, CONSTRAINT "FK_b75c4e5c0bc645d7d0b02258f8e" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "cat"("id", "name", "breed", "ownerId", "lastFed") SELECT "id", "name", "breed", "ownerId", "lastFed" FROM "temporary_cat"`);
        await queryRunner.query(`DROP TABLE "temporary_cat"`);
    }

}
