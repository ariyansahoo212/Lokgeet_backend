const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");
const userRouter = require("./routes/userRoutes");
const GayakRouter = require("./routes/GayakRoutes");
const appointRouter = require("./routes/appointRoutes");
const path = require("path");
const notificationRouter = require("./routes/notificationRouter");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/user", userRouter);
app.use("/api/Gayak", GayakRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);

// app.use(express.static(path.join(__dirname, "./client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});