import express from "express";
import usersRouter from "./routes/usersRouter.js";
import friendsRouter from "./routes/friendsRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
import betsRouter from "./routes/betsRouter.js";
import cors from "cors";
import multer from "multer";
import { checkTaskComplete } from "./ai.js";
import { getTaskDescription } from "./model/queries.js";
import { unlink } from "node:fs";
import { tasksCompletePost } from "./controllers/tasksController.js";

// const upload = multer({ dest: "./public/data/uploads/" });
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/bets", betsRouter);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/data/uploads");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});
const upload = multer({ storage: storage });

app.post(
  "/api/uploads",
  upload.single("uploaded_file"),
  async function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    const description = await getTaskDescription(req.body.id);
    console.log(description)
    const result = await checkTaskComplete(
      description,
      req.file.path,
      req.file.mimetype
    );

    console.log(result);
    // Assuming that 'path/file.txt' is a regular file.
    unlink(req.file.path, (err) => {
      if (err) throw err;
      console.log(req.file.path + " was deleted");
    });

    if (result == "yes") {
      res.setHeader("Authorization", req.headers.authorization);
      await tasksCompletePost(req, res);
      res.status(200).json({ message: "File uploaded successfully" });

    } else {
      res.status(400).json({ message: "File does not meet requirements." });
    }
  }
);

app.listen(3000);
