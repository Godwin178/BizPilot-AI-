import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const databaseConfigured = Boolean(process.env.DATABASE_URL);

test('record queries are isolated by owner', { skip: !databaseConfigured }, async () => {
  const { migrate, pool, query } = await import('../db.js');
  await migrate();
  const first = crypto.randomUUID();
  const second = crypto.randomUUID();
  try {
    await query('INSERT INTO users(id,email,name,password_hash) VALUES($1,$2,$3,$4),($5,$6,$7,$8)', [first, `${first}@test.local`, 'First', 'test', second, `${second}@test.local`, 'Second', 'test']);
    await query('INSERT INTO records(id,user_id,collection,title) VALUES($1,$2,$3,$4)', [crypto.randomUUID(), first, 'tasks', 'Private task']);
    const result = await query('SELECT title FROM records WHERE user_id=$1 AND collection=$2', [second, 'tasks']);
    assert.deepEqual(result.rows, []);
  } finally {
    await query('DELETE FROM users WHERE id IN ($1,$2)', [first, second]);
    await pool.end();
  }
});
