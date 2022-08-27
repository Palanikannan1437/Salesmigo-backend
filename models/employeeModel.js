const mongoose = require("mongoose");
const validator = require("validator");

//model for both workers and manager
const EmployeeSchema = mongoose.Schema({
  employee_name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  employee_email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  employee_photo: String,
  password: {
    type: String,
    required: false,
    minlength: 8,
  },
  employee_designation: {
    type: String,
    required: [true, "Please provide your designation"],
    enum: ["Manager", "Worker"],
    default: "Worker",
  },
  employee_teamID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StaffTeams",
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
