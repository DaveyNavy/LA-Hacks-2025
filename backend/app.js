import express from "express";
import usersRouter from "./routes/usersRouter.js";
const app = express();

app.use("/api", usersRouter);

app.listen(3000);
