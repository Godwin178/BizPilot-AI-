import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = fileURLToPath(new URL('.', import.meta.url));
try { const env = readFileSync(join(root, '.env'), 'utf8'); for (const line of env.split('\n')) { const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, ''); } } catch {}

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined, max: 10 });
export const query = (text, params) => pool.query(text, params);
export async function migrate() { const sql = await readFile(join(root, 'migrations', '001_initial.sql'), 'utf8'); await query(sql); }
