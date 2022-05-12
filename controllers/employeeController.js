const employeeModel = require("../models/employeeModel");
const { catchAsync } = require("../utils/catchAsync");

exports.registerWorker = catchAsync(async (req, res, next) => {
  const newEmployee = await employeeModel.create({
    employee_name: req.body.employee_name,
    employee_email: req.body.employee_email,
  });
  res.status(201).json({
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
  res.status(201).json({
    status: "Employee Registered",  
    employee: newEmployee,
  });
});
