const StaffTeamModel = require("../models/staffTeamModel");
const catchAsync = require("../utils/catchAsync");

exports.getTeamData = catchAsync(async (req, res, next) => {
  const team = await StaffTeamModel.find({ _id: req.params.teamid });
  res.status(200).json({
    status: "success",
    teamData: team,
  });
});
