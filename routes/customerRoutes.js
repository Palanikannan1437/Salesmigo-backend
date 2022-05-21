const express = require("express");
const customerRouter = express.Router();

const customerController = require("../controllers/customerController");
const authController = require("../controllers/authController");

customerRouter.route("/customer").post(
  // authController.protect,
  // authController.restrictTo("Manager", "Worker"),
  customerController.registerCustomer
);
customerRouter.route("/customer/find").post(
  // authController.protect,
  // authController.restrictTo("Manager", "Worker"),
  customerController.findCustomer
);

customerRouter.route("/customer/find1").post(
  // authController.protect,
  // authController.restrictTo("Manager", "Worker"),
  customerController.findCustomer1
);

module.exports = customerRouter;
