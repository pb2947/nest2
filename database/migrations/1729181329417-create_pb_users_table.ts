import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePbUsersTable1729181329417 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'email',
          type: 'varchar',
          isUnique: true,
          isNullable: true,
        },
        {
          name: 'username',
          type: 'varchar',
          isUnique: true,
          isNullable: true,
        },
        {
          name: 'password',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'photo',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'about',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'datetime',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'datetime',
          default: 'now()',
          isNullable: true,
        },
        {
          name: 'deleted_at',
          type: 'datetime',
          isNullable: true,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
