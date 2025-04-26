import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUser, createUser } from "../model/queries.js";

const loginPagePost = async (req, res) => {
  const { username, password } = req.body;
  const user = await findUser(username);
  if (user) {
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    if (bcrypt.compare(hashedPassword, user["password"])) {
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
  console.log(hashedPassword);
  createUser(username, hashedPassword);
  res.sendStatus(200);
};

export { loginPagePost, registerPagePost };
