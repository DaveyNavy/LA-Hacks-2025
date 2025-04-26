import jwt from "jsonwebtoken";
import { getAllTasks } from "../model/queries.js";

const tasksPageGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });
  const result = await getAllTasks(user["username"]);
  res.json(result);
};

export { tasksPageGet };
