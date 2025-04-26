import express from "express";
import usersRouter from "./routes/usersRouter.js";
import friendsRouter from "./routes/friendsRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
import betsRouter from "./routes/betsRouter.js";
import cors from "cors";
import multer from "multer";
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

app.post("/api/uploads", upload.single("uploaded_file"), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file.mimetype, req.file.path);
});

app.listen(3000);
