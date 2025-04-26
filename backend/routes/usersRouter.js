import Router from "express";
import { loginPageGet } from "../controllers/usersController.js";
const usersRouter = Router();

usersRouter.get("/login", loginPageGet);

export default usersRouter;
