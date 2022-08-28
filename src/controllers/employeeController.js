const employeeModel = require("../models/employeeModel");
const staffTeamModel = require("../models/staffTeamModel");
const catchAsync = require("../utils/catchAsync");

exports.registerWorker = catchAsync(async (req, res, next) => {
  const newEmployee = await employeeModel.create({
    employee_name: req.body.employee_name,
    employee_email: req.body.employee_email,
    employee_teamID: req.body.staffTeam_id,
  });

  await staffTeamModel.updateOne(
    { _id: req.body.staffTeam_id },
    { $addToSet: { workers: newEmployee["_id"] } }
  );

  return res.status(201).json({
    status: "Employee Registered",
    employee: newEmployee,
  });
});

exports.registerManager = catchAsync(async (req, res, next) => {
  const newEmployee = await employeeModel.create({
    employee_name: req.body.employee_name,
    employee_email: req.body.employee_email,
    employee_designation: "Manager",
  });

  const newStaffTeam = await staffTeamModel.create({
    teamName: req.body.team_name,
    manager: newEmployee["_id"],
  });

  await employeeModel.updateOne(
    { _id: newEmployee["_id"] },
    { employee_teamID: newStaffTeam["_id"] }
  );

  return res.status(201).json({
    status: "Employee Registered",
    employee: newEmployee,
    staffTeam: newStaffTeam["_id"],
  });
});
