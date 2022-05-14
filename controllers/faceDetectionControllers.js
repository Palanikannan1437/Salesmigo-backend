const customerModel = require("../models/customerModel");
const { catchAsync } = require("../utils/catchAsync");
// require('@tensorflow/tfjs-node');
const faceapi = require("face-api.js");
const { Canvas, Image } = require("canvas");
const canvas = require("canvas");

faceapi.env.monkeyPatch({ Canvas, Image });

exports.uploadLabeledImages = async (images) => {
  let counter = 0;
  const descriptions = [];

  for (let i = 0; i < images.length; i++) {
    const img = await canvas.loadImage(images[i]);
    // Read each face and save the face descriptions in the descriptions array
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    descriptions.push(detections.descriptor);
  }
  return descriptions;
};

exports.getDescriptorsFromDB = async (image) => {
  // Get all the face data from mongodb and loop through each of them to read the data
  const faces = await customerModel.find(
    {},
    { customer_img_label: 1, customer_img_descriptions: 1 }
  );

  for (i = 0; i < faces.length; i++) {
    // Change the face data descriptors from Objects to Float32Array type
    for (j = 0; j < faces[i].customer_img_descriptions.length; j++) {
      faces[i].customer_img_descriptions[j] = new Float32Array(
        Object.values(faces[i].customer_img_descriptions[j])
      );
    }
    // Turn the DB face docs to
    faces[i] = new faceapi.LabeledFaceDescriptors(
      faces[i].customer_img_label,
      faces[i].customer_img_descriptions
    );
  }

  // Load face matcher to find the matching face
  const faceMatcher = new faceapi.FaceMatcher(faces);

  // Read the image using canvas or other method
  const img = await canvas.loadImage(image);
  let temp = faceapi.createCanvasFromMedia(img);

  // Process the image for the model
  const displaySize = { width: img.width, height: img.height };
  faceapi.matchDimensions(temp, displaySize);

  // Find matching faces
  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withFaceDescriptors();
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  const results = resizedDetections.map((d) =>
    faceMatcher.findBestMatch(d.descriptor)
  );
  return results;
};
