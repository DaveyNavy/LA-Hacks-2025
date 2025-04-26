import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  findUser,
  createUser,
  findAllUsersLike,
  createFriendRequest,
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
  await createFriendRequest(username, user["username"]);
  res.sendStatus(200);
};

export { loginPagePost, registerPagePost, usersPageGet, userRequestPost };
