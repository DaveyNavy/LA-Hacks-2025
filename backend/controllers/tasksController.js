import jwt from "jsonwebtoken";
import { getAllTasks, addTask, deleteTask, updateTask, completeTask, } from "../model/queries.js";

const tasksPageGet = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });
  const result = await getAllTasks(user["username"]);
  res.json(result);
};

const tasksPagePost = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const { desc, date } = req.body;

  if (!desc || !date) {
    return res.status(400).json({ error: "Description and date are required" });
  }

  const result = await addTask(username, desc, date);

  res.json(result);
}

const tasksPageDelete = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const taskId = req.params.taskId;

  await deleteTask(username, taskId);

  res.json({ message: "Task deleted successfully" });
}

const tasksPagePut = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const taskId = req.params.taskId;
  const { desc } = req.body;

  if (!desc) { 
    return res.status(400).json({ error: "Description is required" });
  }

  await updateTask(username, taskId, desc);

  res.json({ message: "Task updated successfully" });
}

const tasksCompletePost = async (req, res) => {
  let user;
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      user = authData["user"];
    }
  });

  const username = user["username"];
  const taskId = req.params.taskId;

  await completeTask(username, taskId);

  res.json({ message: "Task completed successfully" });
}

export { tasksPageGet, tasksPagePost, tasksPageDelete, tasksPagePut, tasksCompletePost, };
