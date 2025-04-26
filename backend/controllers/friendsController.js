import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";
const sql = neon(process.env.DATABASE_URL);

const getFriends = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  const result = await sql.query(
    `SELECT friend FROM friends WHERE username = $1`,
    [username]
  );

  res.json(result);
};

export { getFriends };

const getFriendsTasks = async (req, res) => {
    let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });
  console.log(user);
  const username = user.username;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  const friends = await sql.query(
    `SELECT friend FROM friends WHERE username = $1`,
    [username]
  );

  console.log(friends);

  const friendUsernames = friends.map((friend) => friend.friend);

  const tasks = await sql.query(
    `SELECT * FROM tasks WHERE username = ANY($1)`,
    [friendUsernames]
  );

    res.json(tasks);
}

export { getFriendsTasks };
