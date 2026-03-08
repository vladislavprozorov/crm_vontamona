import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1772797494133 implements MigrationInterface {
  name = 'Init1772797494133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(128) NOT NULL, "email" character varying NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(128) NOT NULL, "title" character varying NOT NULL, "status" text NOT NULL, "client_id" uuid, "comment" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "requests" ADD CONSTRAINT "FK_e336e481a84734861089a92a233" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requests" DROP CONSTRAINT "FK_e336e481a84734861089a92a233"`,
    );
    await queryRunner.query(`DROP TABLE "requests"`);
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
