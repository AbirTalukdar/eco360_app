import { query } from '../db';

export async function getUserByUsername(username) {
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

export async function createUser(username, email, password) {
  await query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, password]
  );
}