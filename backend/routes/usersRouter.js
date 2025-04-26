import Router from "express";
import { loginPagePost } from "../controllers/usersController.js";
const usersRouter = Router();

usersRouter.post("/login", loginPagePost);

export default usersRouter;
