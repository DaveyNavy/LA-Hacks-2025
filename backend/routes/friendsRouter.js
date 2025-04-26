import Router from "express";
import { getFriends } from "../controllers/friendsController.js";
const friendsRouter = Router();

friendsRouter.get("/", verifyToken, getFriends);

// router.get('/tasks', getFriendsTasks);

// router.get('/requests', getFriendRequests);

// router.get('/requests/:username', respondToFriendRequest);

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

export default friendsRouter;
