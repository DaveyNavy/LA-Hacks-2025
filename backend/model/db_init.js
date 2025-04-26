import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

await sql.query(`CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),
    currency INTEGER
);`);

await sql.query(`CREATE TABLE IF NOT EXISTS friends (
    username VARCHAR(255),
    friend VARCHAR(255)
);`);

await sql.query(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    username VARCHAR(255) REFERENCES users(username),
    description TEXT,
    dueDate DATE,
    isComplete BOOLEAN,
    betAmount INTEGER
);`);

await sql.query(`CREATE TABLE IF NOT EXISTS bets (
    id INTEGER PRIMARY KEY,
    taskId INTEGER REFERENCES tasks(id),
    username VARCHAR(255) REFERENCES users(username),
    date DATE
);`);
