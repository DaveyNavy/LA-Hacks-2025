import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

async function findUser(username) {
  const result = await sql.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result[0];
}

async function createUser(username, password) {
  await sql.query("INSERT INTO users VALUES ($1, $2, $3)", [
    username,
    password,
    0,
  ]);
}

export { findUser, createUser };
