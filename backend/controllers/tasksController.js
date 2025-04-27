import jwt from "jsonwebtoken";
import {
  getAllTasks,
  addTask,
  deleteTask,
  updateTask,
  completeTask,
  getBets,
  getTaskBet,
  getUserInfo,
  updateUserCurrency,
} from "../model/queries.js";

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
  console.log("Here");
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

  console.log(result);

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
};

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
};

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
  const currDate = new Date();

  const bets = await getBets(taskId);
  const betDates = bets.map((bet) => bet.date);
  const betUsers = bets.map((bet) => bet.username);
  const taskBet = await getTaskBet(taskId);
  const betAmount = taskBet[0].betamount;

  let minBet = 8640000000000000;
  for (let i = 0; i < betDates.length; i++) {
    const betDate = new Date(betDates[i]);
    const diffTime = Math.abs(currDate - betDate);
    if (diffTime < minBet) {
      minBet = diffTime;
    }
  }

  console.log(minBet);

  let minBets = [];
  for (let i = 0; i < betUsers.length; i++) {
    const betDate = new Date(betDates[i]);
    const diffTime = Math.abs(currDate - betDate);
    if (diffTime == minBet) {
      minBets.push(betUsers[i]);
    }
  }
  
  const winnerAmount = (betUsers.length *  betAmount) / minBets.length;

  for (let i = 0; i < minBets.length; i++) {
    const winner = await getUserInfo(minBets[i]);
    await updateUserCurrency(minBets[i], winner[0].currency + winnerAmount);
  }

  const userInfo = await getUserInfo(username);

  await updateUserCurrency(username, userInfo[0].currency + 100);

  await completeTask(username, taskId);

  res.json({ message: "Task completed successfully" });
};

export {
  tasksPageGet,
  tasksPagePost,
  tasksPageDelete,
  tasksPagePut,
  tasksCompletePost,
};
