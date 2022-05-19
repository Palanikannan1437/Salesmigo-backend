const express = require("express");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/errorController");

const faceapi = require("@vladmandic/face-api");

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
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(compression());
// //for cookies to work
// app.use((req, res, next) => {
//   res.header("Content-Type", "application/json;charset=UTF-8");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

const employeeRouter = require("./routes/employeeRoutes");
app.use("/api/v1/employees", employeeRouter);

const customerRouter = require("./routes/customerRoutes");
const compression = require("compression");

app.use("/api/v1/customers", customerRouter);

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
