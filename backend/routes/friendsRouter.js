import Router from "express";
import {
  friendsPageGet,
  friendsTasksPageGet,
} from "../controllers/friendsController.js";
import { verifyToken } from "./utils.js";
const friendsRouter = Router();

friendsRouter.get("/", verifyToken, friendsPageGet);

friendsRouter.get("/tasks", verifyToken, friendsTasksPageGet);

// router.get('/requests', getFriendRequests);

// router.get('/requests/:username', respondToFriendRequest);

export default friendsRouter;
