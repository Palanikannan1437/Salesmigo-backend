const mongoose = require("mongoose");
const validator = require("validator");

const EmployeeSchema = mongoose.Schema({
  customer_name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  customer_email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },

  customer_photo: String,
  customer_address: String,
  customer_phoneNumber: String,
  customer_DateOfBirth: Date,
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
