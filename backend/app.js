import express from "express";
import usersRouter from "./routes/usersRouter.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);

app.listen(3000);
