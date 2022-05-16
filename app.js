const express = require("express");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
var cors = require("cors");

const faceapi = require("face-api.js");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const employeeRouter = require("./routes/employeeRoutes");
app.use("/api/v1/employees", employeeRouter);


const customerRouter = require("./routes/customerRoutes");
app.use("/api/v1/customers", customerRouter);


async function LoadModels() {
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/modelsFace");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/modelsFace");
  await faceapi.nets.tinyFaceDetector.loadFromDisk(__dirname + "/modelsFace");
}
LoadModels();

//all invalid urls handled here!
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
});

//for cookies to work
app.use((req, res, next) => {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//global middleware for error handling
app.use((err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
