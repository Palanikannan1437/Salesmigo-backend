const express = require("express");
const employeeRouter = express.Router();

const employeeController = require("../controllers/employeeController");
const authController = require("../controllers/authController");

employeeRouter.route("/login-google").post(authController.login_google);

employeeRouter
  .route("/worker")
  .post(
    // authController.protect,
    // authController.restrictTo("Manager"),
    employeeController.registerWorker
  );

employeeRouter.route("/manager").post(employeeController.registerManager);

module.exports = employeeRouter;
