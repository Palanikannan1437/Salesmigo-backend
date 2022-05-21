const express = require("express");
const teamRouter = express.Router();

const teamController = require("../controllers/teamController");

teamRouter.route("/:teamid").get(teamController.getTeamData);

module.exports = teamRouter;
