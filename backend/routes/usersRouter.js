import Router from "express";
import {
  loginPagePost,
  registerPagePost,
  userRequestPost,
  usersPageGet,
} from "../controllers/usersController.js";
const usersRouter = Router();

usersRouter.post("/login", loginPagePost);
usersRouter.post("/register", registerPagePost);
usersRouter.get("/:username", verifyToken, usersPageGet);
usersRouter.post("/:username/request", verifyToken, userRequestPost);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

export default usersRouter;
