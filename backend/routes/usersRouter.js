import Router from "express";
const usersRouter = Router();

usersRouter.get("/", (req, res) => {
  res.json({ user: "Hello" });
});

export default usersRouter;
