const express = require("express");
const customerRouter = express.Router();

const customerController = require("../controllers/customerController");
const authController = require("../controllers/authController");

customerRouter.route("/customer").post(customerController.registerCustomer);
customerRouter.route("/customer/find").post(customerController.findCustomer);

module.exports = customerRouter;
