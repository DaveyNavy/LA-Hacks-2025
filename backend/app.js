import express from "express";
import usersRouter from "./routes/usersRouter.js";
import friendsRouter from "./routes/friendsRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
import betsRouter from "./routes/betsRouter.js";
import cors from "cors";
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/bets", betsRouter);

app.listen(3000);
