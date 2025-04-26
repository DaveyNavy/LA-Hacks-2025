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

async function findAllUsersLike(substring) {
  const result = await sql.query(
    "SELECT username FROM users WHERE username LIKE " + "'" + substring + "%'"
  );
  return result;
}

async function createFriendRequest(username, requester) {
  await sql.query("INSERT INTO friend_requests VALUES ($1, $2)", [
    username,
    requester,
  ]);
}

async function getAllTasks(username) {
  const result = await sql.query("SELECT * FROM tasks WHERE username = $1", [
    username,
  ]);
  return result;
}

async function getAllFriends(username) {
  const result = await sql.query(
    `SELECT friend FROM friends WHERE username = $1`,
    [username]
  );
  return result;
}

async function getFriendsTasks(friendUsernames) {
  const tasks = await sql.query(
    `SELECT * FROM tasks WHERE username = ANY($1)`,
    [friendUsernames]
  );
  return tasks;
}

async function getFriendRequests(username) {
  const result = await sql.query(
    `SELECT requester FROM friend_requests WHERE username = $1`,
    [username]
  );
  return result;
}

async function respondToFriendRequest(username, requester, response) {
  if (response === "accept") {
    await sql.query("INSERT INTO friends VALUES ($1, $2)", [
      username,
      requester,
    ]);
  }
  await sql.query("DELETE FROM friend_requests WHERE username = $1 AND requester = $2", [
    username,
    requester,
  ]);
}

async function addTask(username, desc, date) {
  await sql.query("INSERT INTO tasks (username, description, dueDate) VALUES ($1, $2, $3)", [
    username, 
    desc, 
    date
  ]);
}

async function deleteTask(username, taskId) {
  await sql.query("DELETE FROM tasks WHERE username = $1 AND id = $2", [
    username,
    taskId,
  ]);
}

async function updateTask(username, taskId, desc) {
  await sql.query("UPDATE tasks SET description = $1 WHERE username = $2 AND id = $3", [
    desc,
    username,
    taskId,
  ]);
}

async function completeTask(username, taskId) {
  await sql.query("UPDATE tasks SET isComplete = true WHERE username = $1 AND id = $2", [
    username,
    taskId,
  ]);
}

export {
  findUser,
  createUser,
  findAllUsersLike,
  createFriendRequest,
  getAllFriends,
  getFriendsTasks,
  getAllTasks,
  getFriendRequests,
  respondToFriendRequest,
  addTask,
  deleteTask,
  updateTask,
  completeTask,
};
