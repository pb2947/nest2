import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();
export default new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['database/migrations/**/*.{ts,js}'],
} as DataSourceOptions);
