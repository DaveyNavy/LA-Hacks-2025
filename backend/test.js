import "dotenv/config";
import { neon } from "@neondatabase/serverless";
console.log(process.env);
const sql = neon(process.env.DATABASE_URL);

await sql.query(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER,
    name VARCHAR(255)
);`);

await sql.query(`INSERT INTO users VALUES (1, 'Bob');`);

let results = await sql.query("SELECT * FROM users;");

console.log(results);
