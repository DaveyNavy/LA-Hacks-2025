import "dotenv/config";
import { getTaskBet, placeBet } from "../model/queries.js";
import jwt from "jsonwebtoken";

const betsPagePost = async (req, res)  => {
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
    const { betAmount, date } = req.body;

    const betStatus = await getTaskBet(taskId);

    if (!betAmount || !date) {
        return res.status(400).json({ error: "Bet amount and date are required" });
    }

    
    if (betStatus[0].betamount == null) {
        await placeBet(username, taskId, betAmount, date);
    }
    else {
        return res.status(400).json({ error: "Bet already placed for this task" });
    }
}

export { betsPagePost };