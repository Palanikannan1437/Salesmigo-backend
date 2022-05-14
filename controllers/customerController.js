const customerModel = require("../models/customerModel");
const faceDetectionContoller = require("./faceDetectionControllers");
const { catchAsync } = require("../utils/catchAsync");

exports.registerCustomer = catchAsync(async (req, res, next) => {
  const images = req.body.customer_images.map((files) => {
    return files.url;
  });

  const result = await faceDetectionContoller.uploadLabeledImages(
    images,
    req.body.customer_name + "_" + req.body.customer_email
  );

  const newCustomer = await customerModel.create({
    customer_name: req.body.customer_name,
    customer_email: req.body.customer_email,
    customer_location: req.body.customer_location,
    customer_phoneNumber: req.body.customer_phoneNumber,
    customer_dateOfBirth: req.body.customer_dateOfBirth,
    customer_images: req.body.customer_images,
    customer_img_descriptions: result,
    customer_img_label: req.body.customer_name + "_" + req.body.customer_email,
  });
  res.status(201).json({
    status: "Customer Registered",
    employee: newCustomer,
  });
});

exports.findCustomer = catchAsync(async (req, res, next) => {
  let result = await faceDetectionContoller.getDescriptorsFromDB(req.body.customer_images.url);
  res.status(200).json({
    status: "Customer Found!",
    employee: result,
  });
});
