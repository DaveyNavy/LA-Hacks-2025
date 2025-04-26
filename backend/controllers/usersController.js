import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUser } from "../model/queries.js";

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
  } else {
    res.sendStatus(403);
  }
}

const loginPagePost = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const user = await findUser(username);
  if (user) {
    //const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;
    console.log(hashedPassword);
    console.log(user["password"]);

    if (hashedPassword == user["password"]) {
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

export { loginPagePost };
