const aisleModel = require("../models/aisleModel");
const catchAsync = require("../utils/catchAsync");

exports.createAisle = catchAsync(async (req, res, next) => {
  const newAisle = await aisleModel.create({
    aisleName: req.body.aisleName,
    fashionItem: req.body.fashionItem,
    priceRange: req.body.priceRange,
  });
  
  return res.status(201).json({
    status: `Aisle: ${newAisle.aisleName} Created`,
  });
});

exports.getAllAisles = catchAsync(async (req, res, next) => {
  const aisles = await aisleModel.find({}, { aisleName: 1 });
  return res.status(200).json({
    status: `Success`,
    results: aisles.length,
    aisles,
  });
});
