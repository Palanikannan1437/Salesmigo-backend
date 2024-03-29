const mongoose = require("mongoose");

//for various aisles/parts of the store
const AisleModel = mongoose.Schema({
  aisleName: {
    type: String,
    unique: true,
    required: [true, "Please enter Aisle Name!"],
  },

  fashionItem: {
    type: String,
    required: [true, "Please enter fashion item's name"],
    lowercase: true,
  },

  priceRange: Number,
});

const Aisle = mongoose.model("Aisle", AisleModel);

module.exports = Aisle;