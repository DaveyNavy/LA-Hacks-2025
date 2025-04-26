import Router from "express";
import { tasksPageGet } from "../controllers/tasksController.js";
import { verifyToken } from "./utils.js";
const tasksRouter = Router();

tasksRouter.get("/", verifyToken, tasksPageGet);

export default tasksRouter;
