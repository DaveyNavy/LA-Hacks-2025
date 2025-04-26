import express from "express";
import usersRouter from "./routes/usersRouter.js";
import friendsRouter from "./routes/friendsRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/tasks", tasksRouter);

app.listen(3000);
