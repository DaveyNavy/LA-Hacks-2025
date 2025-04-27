import "dotenv/config";
import { getTaskBet, placeBet, getUserInfo, updateUserCurrency } from "../model/queries.js";
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

    const userInfo = await getUserInfo(username);
    if (userInfo[0].currency < betAmount) {
        return res.status(400).json({ error: "Not enough currency" });
    }

    if (betStatus[0].betamount == null || betStatus[0].betamount == betAmount) {
        await placeBet(username, taskId, betAmount, date);
        await updateUserCurrency(username, userInfo[0].currency - betAmount);
    }
    else {
        return res.status(400).json({ error: "Bad bet" });
    }
}

export { betsPagePost };