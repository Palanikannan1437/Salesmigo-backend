const express = require("express");
const customerRouter = express.Router();

const customerController = require("../controllers/customerController");
const rateLimit = require("express-rate-limit");

// since registering each customer is a super cpu intensive task(tfjs!),performing some rate
// limiting would be better to prevent DDoS attacks!
const registrationApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins(since avg time for each registration is 4sec)
  max: 30, // Limiting each IP to 10 requests per 10mins!
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

//registering a customer for the first time
customerRouter
  .route("/")
  .post(registrationApiLimiter, customerController.registerCustomer);

//recognizing customer by matching their face descriptor with face descriptors of customers
//in our db using worker threads!
customerRouter.route("/find").post(customerController.findCustomer);

//adding customer emotions and gestures in various ailes to our database
customerRouter.route("/emotion").post(customerController.addCustomerEmotion);
customerRouter.route("/gesture").post(customerController.addCustomerGesture);

//TEST BRANCHES!!

//recognizing customer by matching their face descriptor with face descriptors of customers
//in a json file replicating our db to make mutiple read requests to fake a huge database
//using worker threads!
customerRouter.route("/find-test").post(customerController.findCustomerTest);

//recognizing customer by matching their face descriptor with face desciptors of customers
//in our db by iterating through each face descriptor one by one
customerRouter
  .route("/findOldInefficient")
  .post(customerController.findCustomerOldInefficient);

module.exports = customerRouter;
