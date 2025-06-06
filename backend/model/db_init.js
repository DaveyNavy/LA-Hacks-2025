import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

await sql.query(`CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),
    currency INTEGER,
    numOfTasksCompleted INTEGER DEFAULT 0
);`);

await sql.query(`CREATE TABLE IF NOT EXISTS friends (
    username VARCHAR(255) REFERENCES users(username),
    friend VARCHAR(255) REFERENCES users(username)
);`);

await sql.query(`CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES users(username),
    description TEXT,
    dueDate VARCHAR(255),
    isComplete BOOLEAN DEFAULT FALSE,
    betAmount INTEGER DEFAULT NULL,
    dateCreated VARCHAR(255),
    dateCompleted VARCHAR(255)
);`);

await sql.query(`CREATE TABLE IF NOT EXISTS bets (
    id SERIAL PRIMARY KEY,
    taskId INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    username VARCHAR(255) REFERENCES users(username),
    date VARCHAR(255)
);`);

await sql.query(`CREATE TABLE IF NOT EXISTS friend_requests (
    username VARCHAR(255) REFERENCES users(username),
    requester VARCHAR(255) REFERENCES users(username)
);`);
