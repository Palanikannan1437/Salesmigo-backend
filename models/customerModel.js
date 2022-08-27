const mongoose = require("mongoose");
const validator = require("validator");

const CustomerSchema = mongoose.Schema({
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

  customer_location: String,
  customer_phoneNumber: String,
  customer_dateOfBirth: Date,
  customer_images: Array,

  customer_img_label: {
    type: String,
    required: true,
    unique: true,
  },

  customer_img_descriptions: {
    type: Array,
    required: true,
  },

  customer_gender: {
    type: String,
  },

  customer_emotions: {
    type: Array,
  },
  customer_gestures: {
    type: Array,
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
