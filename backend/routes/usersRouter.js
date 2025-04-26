import Router from "express";
import {
  loginPagePost,
  registerPagePost,
} from "../controllers/usersController.js";
const usersRouter = Router();

usersRouter.post("/login", loginPagePost);
usersRouter.post("/register", registerPagePost);

export default usersRouter;
