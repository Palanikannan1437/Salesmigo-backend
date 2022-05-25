const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const limiter = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/errorController");

const faceapi = require("@vladmandic/face-api");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  limiter({
    windowMs: 1 * 60 * 1000, //750 per min requests allowed from one IP address
    max: 750,
    message: {
      code: 429,
      message: "Too many requests made, please try again later",
    },
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(
  compression({
    level: 6,
    threshold: 5 * 1000,
  })
);

const employeeRouter = require("./routes/employeeRoutes");
app.use("/api/v1/employees", employeeRouter);

const customerRouter = require("./routes/customerRoutes");
app.use("/api/v1/customers", customerRouter);

const teamRouter = require("./routes/teamRoutes");
app.use("/api/v1/teams", teamRouter);


async function LoadModels() {
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/modelsFace");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/modelsFace");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/modelsFace");
}
LoadModels();

//all invalid urls handled here!
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//global middleware for error handling
app.use(globalErrorController);

module.exports = app;
