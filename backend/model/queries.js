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
  console.log("Done");
}

async function getAllTasks(username) {
  const result = await sql.query(
    `
    SELECT 
      tasks.id AS taskId,
      tasks.username,
      tasks.description,
      tasks.dueDate,
      tasks.isComplete,
      tasks.betAmount,
      COALESCE(
        json_agg(
          json_build_object('username', bets.username, 'date', bets.date)
        ) FILTER (WHERE bets.username IS NOT NULL),
        '[]'
      ) AS bets
    FROM tasks
    LEFT JOIN bets ON tasks.id = bets.taskId
    WHERE tasks.username = $1
    GROUP BY tasks.id
    `,
    [username]
  );
  return result;
}

async function getAllFriends(username) {
  const result = await sql.query(
    `SELECT users.username, users.currency, users.numoftaskscompleted 
    FROM friends JOIN users ON users.username = friends.friend
    WHERE friends.username = $1 `,
    [username]
  );
  return result;
}

async function getFriendsTasks(friendUsernames) {
  const result = await sql.query(
    `SELECT 
      tasks.id AS taskId,
      tasks.username,
      tasks.description,
      tasks.dueDate,
      tasks.isComplete,
      tasks.betAmount,
      COALESCE(
        json_agg(
          json_build_object('username', bets.username, 'date', bets.date)
        ) FILTER (WHERE bets.username IS NOT NULL),
        '[]'
      ) AS bets
    FROM tasks
    LEFT JOIN bets ON tasks.id = bets.taskId
    WHERE tasks.username = ANY($1)
    GROUP BY tasks.id`,
    [friendUsernames]
  );

  return result;
}

async function getFriendRequests(username) {
  const result = await sql.query(
    `SELECT requester FROM friend_requests WHERE username = $1`,
    [username]
  );
  return result;
}

async function getOutgoingRequests(username) {
  const result = await sql.query(
    `SELECT username FROM friend_requests WHERE requester = $1`,
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
    await sql.query("INSERT INTO friends VALUES ($1, $2)", [
      requester,
      username,
    ]);
  }
  await sql.query(
    "DELETE FROM friend_requests WHERE username = $1 AND requester = $2",
    [username, requester]
  );
}

async function addTask(username, desc, date) {
  await sql.query(
    "INSERT INTO tasks (username, description, dueDate) VALUES ($1, $2, $3)",
    [username, desc, date]
  );
  const result = await sql.query(
    `INSERT INTO tasks (username, description, dueDate) VALUES ($1, $2, $3)
    RETURNING id`,
    [username, desc, date]
  );

  return result[0].id;
}

async function deleteTask(username, taskId) {
  await sql.query("DELETE FROM tasks WHERE username = $1 AND id = $2", [
    username,
    taskId,
  ]);
}

async function updateTask(username, taskId, desc) {
  await sql.query(
    "UPDATE tasks SET description = $1 WHERE username = $2 AND id = $3",
    [desc, username, taskId]
  );
}

async function completeTask(username, taskId) {
  await sql.query(
    "UPDATE tasks SET isComplete = true WHERE username = $1 AND id = $2",
    [username, taskId]
  );
  await sql.query(
    "UPDATE users SET numOfTasksCompleted = numOfTasksCompleted + 1 WHERE username = $1",
    [username]
  );
}

async function getTaskDescription(taskId) {
  const result = await sql.query(
    "SELECT description FROM tasks WHERE id = $1",
    [taskId]
  );
  return result;
}

async function getTaskBet(taskId) {
  const result = await sql.query("SELECT betAmount FROM tasks WHERE id = $1", [
    taskId,
  ]);
  return result;
}

async function placeBet(username, taskId, betAmount, date) {
  await sql.query(
    "INSERT INTO bets (username, taskId, date) VALUES ($1, $2, $3)",
    [username, taskId, date]
  );
  await sql.query("UPDATE tasks SET betAmount = $1 WHERE id = $2", [
    betAmount,
    taskId,
  ]);
}

async function getUserInfo(username) {
  const result = await sql.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result;
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
  getOutgoingRequests,
  respondToFriendRequest,
  addTask,
  deleteTask,
  updateTask,
  completeTask,
  getTaskDescription,
  getTaskBet,
  placeBet,
  getUserInfo,
};
