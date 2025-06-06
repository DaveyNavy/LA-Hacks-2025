import "dotenv/config";
import {
  getAllFriends,
  getFriendsTasks,
  getFriendRequests,
  respondToFriendRequest,
  getOutgoingRequests,
} from "../model/queries.js";
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
  const friendUsernames = friends.map((friend) => friend.username);
  const result = await getFriendsTasks(friendUsernames);

  res.json(result);
};

const friendRequestsPageGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const requests = await getFriendRequests(username);

  res.json(requests);
};

const friendsOutgoingPageGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const requests = await getOutgoingRequests(username);

  res.json(requests);
};

const friendRequestPost = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const requester = req.params.username;
  const { response } = req.body;

  if (!requester || !response) {
    return res
      .status(400)
      .send({ errors: [{ msg: "Missing requester or response" }] });
  }

  if (response != "accept" && response != "reject") {
    return res
      .status(400)
      .send({ errors: [{ msg: "Invalid response value" }] });
  }

  await respondToFriendRequest(username, requester, response);

  res.json({ message: `Friend request ${response}ed successfully.` });
};

export {
  friendsPageGet,
  friendsTasksPageGet,
  friendRequestsPageGet,
  friendsOutgoingPageGet,
  friendRequestPost,
};
