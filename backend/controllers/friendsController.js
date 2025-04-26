import "dotenv/config";
import { getAllFriends, getFriendsTasks } from "../model/queries.js";
import jwt from "jsonwebtoken";

const friendsPageGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const result = await getAllFriends(username);

  res.json(result);
};

const friendsTasksPageGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];

  const friends = await getAllFriends(username);
  const friendUsernames = friends.map((friend) => friend.friend);
  const tasks = await getFriendsTasks(friendUsernames);

  res.json(tasks);
};

export { friendsPageGet, friendsTasksPageGet };
