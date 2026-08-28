import { Pool } from 'pg';
import { env } from './env';

export const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
});

// Helper simple pour exécuter une requête paramétrée
export async function query(text: string, params: unknown[] = []) {
  return pool.query(text, params);
}
