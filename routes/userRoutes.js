const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/userController");

userRouter.route("/login-google").post(userController.login_google)

userRouter.route("/signup").post(userController.signUp);

module.exports = userRouter;
