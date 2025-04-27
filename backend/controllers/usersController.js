import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  findUser,
  createUser,
  findAllUsersLike,
  createFriendRequest,
  getUserInfo,
  getAllUsers,
} from "../model/queries.js";

const loginPagePost = async (req, res) => {
  const { username, password } = req.body;
  const user = await findUser(username);
  if (user) {
    const match = await bcrypt.compare(password, user["password"]);
    if (match) {
      jwt.sign({ user }, "secretkey", (err, token) => {
        res.json({
          token,
        });
      });
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

const registerPagePost = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  const users = await getAllUsers();
  const usernames = users.map((user) => user.username);
  if (usernames.includes(username)) {
    console.log("Username already exists");
    return res.status(400).send({ errors: [{ msg: "Username already exists" }] });
  }

  if (password != confirmPassword)
    return res
      .status(400)
      .send({ errors: [{ msg: "Passwords do not match" }] });

  const hashedPassword = await bcrypt.hash(password, 10);
  createUser(username, hashedPassword);
  res.sendStatus(200);
};

const usersPageGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });
  const search = req.params.username;
  const result = await findAllUsersLike(search);

  res.json(result);
};

const userRequestPost = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });
  const username = req.params.username;

  if (username == user["username"]) {
    return res.status(400).json({ error: "You cannot send a friend request to yourself" });
  }

  await createFriendRequest(username, user["username"]);
  res.sendStatus(200);
};

const userInfoGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const result = await getUserInfo(username);
  res.json(result);
}

const currentUserGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  return user;
}



export { loginPagePost, registerPagePost, usersPageGet, userRequestPost, userInfoGet, currentUserGet };
