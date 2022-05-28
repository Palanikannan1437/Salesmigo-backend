const express = require("express");
const customerRouter = express.Router();

const customerController = require("../controllers/customerController");
const rateLimit = require("express-rate-limit");

// since registering each user is a super cpu intensive task(tfjs!),performing some rate
// limiting would be better to prevent DDoS attacks!
const registrationApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins(since avg time for each registration is 4sec)
  max: 30, // Limiting each IP to 10 requests per 10mins!
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

customerRouter
  .route("/")
  .post(registrationApiLimiter, customerController.registerCustomer);

customerRouter.route("/find").post(customerController.findCustomer);

customerRouter.route("/emotion").post(customerController.addCustomerEmotion);
customerRouter.route("/gesture").post(customerController.addCustomerGesture);

customerRouter.route("/findOldInefficient").post(customerController.findCustomerOldInefficient);

module.exports = customerRouter;
