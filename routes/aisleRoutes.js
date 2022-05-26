const express = require("express");
const aisleRouter = express.Router();

const aisleController = require("../controllers/aisleController");
const authController = require("../controllers/authController");

aisleRouter.route("/").post(
  // authController.protect,
  // authController.restrictTo("Manager"),
  aisleController.createAisle
);

aisleRouter.route("/").get(
  // authController.protect,
  // authController.restrictTo("Manager"),
  aisleController.getAllAisles
);

module.exports = aisleRouter;
