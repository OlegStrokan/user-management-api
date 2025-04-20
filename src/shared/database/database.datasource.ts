import { DataSource } from 'typeorm';
import { join } from 'path';
import { glob } from 'glob';
import * as dotenv from 'dotenv';

// load env using dotenv because i need exported data source object type for my migration scripts

const envFile = process.env.NODE_ENV === 'test' ? '.test.env' : '.dev.env';
dotenv.config({ path: envFile });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  url: process.env.DATABASE_URL,
  entities: glob.sync(join(__dirname, '..', '..', '**', '*.entity.{ts,js}')),
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  ssl: process.env.NODE_ENV === 'test' ? false : { rejectUnauthorized: false },
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENV === 'test',
});
