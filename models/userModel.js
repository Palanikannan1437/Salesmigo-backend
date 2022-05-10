const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  etalk_registered: { type: Boolean, required: true, default: false },
  innoventure_registered: { type: Boolean, required: true, default: false },
  visionx_registered: { type: Boolean, required: true, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
