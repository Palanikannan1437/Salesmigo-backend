const customerModel = require("../models/customerModel");
const faceDetectionContoller = require("./faceDetectionControllers");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

  return res.status(201).json({
    status: `Customer ${newCustomer.customer_name} Registered`,
  });
});

exports.findCustomer = catchAsync(async (req, res, next) => {
  await faceDetectionContoller.getDescriptorsFromDB(
    new Float32Array(Object.values(req.body.descriptor)),
    req,
    res
  );
});

exports.addCustomerEmotion = catchAsync(async (req, res, next) => {
  const { current_emotion, customer_email, aisleName } = req.body;
  
  //filtering customer with the given customer email inorder to append
  //emotion only if aisle doesn't exist in customer_emotions array
  var conditions = {
    customer_email: customer_email,
    "customer_emotions.aisleName": { $ne: aisleName },
  };

  //if array in document not found for given email and aisle then append
  //a new aisle to new current emotion
  var update = {
    $addToSet: {
      customer_emotions: { emotion: current_emotion, aisleName: aisleName },
    },
  };

  customerModel.findOneAndUpdate(conditions, update, function (err, doc) {
    if (doc === null) {
      //doc found hence modify the emotion to new current emotion
      customerModel.updateOne(
        { "customer_emotions.aisleName": aisleName },
        {
          $set: {
            "customer_emotions.$.emotion": current_emotion,
          },
        },
        function (err) {
          console.log(err);
        }
      );
      return res.status(200).json({
        status: "Emotion modified successfully",
      });
    } else {
      res.status(200).json({
        status: "Emotion added successfully!",
      });
    }
  });
});

exports.addCustomerGesture = catchAsync(async (req, res, next) => {
  const { current_gesture, customer_email, aisleName } = req.body;

  const conditions = {
    customer_email: customer_email,
    "customer_gestures.aisleName": { $ne: aisleName },
  };

  const update = {
    $addToSet: {
      customer_gestures: { gesture: current_gesture, aisleName: aisleName },
    },
  };

  console.log("gesture updating",req.body)
  customerModel.findOneAndUpdate(conditions, update, function (err, doc) {
    if (doc === null) {
      customerModel.updateOne(
        { "customer_gestures.aisleName": aisleName },
        {
          $set: {
            "customer_gestures.$.gesture": current_gesture,
          },
        },
        function (err) {
          return new AppError(`Error in Adding gesture: ${err}`, 404);
        }
      );
      return res.status(200).json({
        status: "Gesture modified successfully",
      });
    } else {
      res.status(200).json({
        status: "Gesture added successfully!",
      });
    }
  });
});

exports.findCustomerOldInefficient = catchAsync(async (req, res, next) => {
  let result = await faceDetectionContoller.getDescriptorsFromDB1(
    req.body.descriptor
  );
  if (result._label === "unknown") {
    return res.status(200).json({
      status: "Customer Not Found!",
    });
  }
  res.status(200).json({
    status: "Customer Found!",
    customer: result,
  });
});
