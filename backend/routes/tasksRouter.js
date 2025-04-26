import Router from "express";
import { tasksPageGet, tasksPagePost, tasksPageDelete, tasksPagePut, tasksCompletePost, } from "../controllers/tasksController.js";
import { verifyToken } from "./utils.js";
const tasksRouter = Router();

tasksRouter.get("/", verifyToken, tasksPageGet);
tasksRouter.post("/", verifyToken, tasksPagePost);
tasksRouter.delete("/:taskId", verifyToken, tasksPageDelete);  
tasksRouter.put("/:taskId", verifyToken, tasksPagePut);
tasksRouter.post("/:taskId/complete", verifyToken, tasksCompletePost);

export default tasksRouter;
