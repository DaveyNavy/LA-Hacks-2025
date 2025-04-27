import Router from "express";
import {
  loginPagePost,
  registerPagePost,
  userRequestPost,
  usersPageGet,
  userInfoGet,
} from "../controllers/usersController.js";
import { verifyToken } from "./utils.js";
const usersRouter = Router();

usersRouter.post("/login", loginPagePost);
usersRouter.post("/register", registerPagePost);
usersRouter.get("/:username", verifyToken, usersPageGet);
usersRouter.post("/:username/request", verifyToken, userRequestPost);
usersRouter.get("/:username/info", verifyToken, userInfoGet);

export default usersRouter;
