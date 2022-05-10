const express = require("express");
const morgan = require("morgan");

var cors = require("cors");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors({
  origin: '*'
}));
app.use(express.json());

const userRouter = require("./routes/userRoutes");
app.use("/api/v1/users", userRouter);

module.exports = app;
