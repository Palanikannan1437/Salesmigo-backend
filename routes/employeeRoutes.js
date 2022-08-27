const express = require("express");
const employeeRouter = express.Router();

const employeeController = require("../controllers/employeeController");
const authController = require("../controllers/authController");

//registering a manager
employeeRouter.route("/manager").post(employeeController.registerManager);

//manager and employee logs in
employeeRouter.route("/login-google").post(authController.login_google);

//registering a worker and can be done only by a manager
//commented out auth restriction parts out for better response time
employeeRouter.route("/worker").post(
  // authController.protect,
  // authController.restrictTo("Manager"),
  employeeController.registerWorker
);

module.exports = employeeRouter;
