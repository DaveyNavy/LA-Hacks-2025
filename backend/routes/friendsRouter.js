import Router from "express";
import {
  friendsPageGet,
  friendsTasksPageGet,
  friendRequestsPageGet,
  friendRequestPost,
  friendsOutgoingPageGet,
} from "../controllers/friendsController.js";
import { verifyToken } from "./utils.js";
const friendsRouter = Router();

friendsRouter.get("/", verifyToken, friendsPageGet);

friendsRouter.get("/tasks", verifyToken, friendsTasksPageGet);

friendsRouter.get("/requests", verifyToken, friendRequestsPageGet);

friendsRouter.post("/requests/:username", verifyToken, friendRequestPost);

friendsRouter.get("/outgoing", verifyToken, friendsOutgoingPageGet);

export default friendsRouter;
