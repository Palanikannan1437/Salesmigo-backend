const customerModel = require("../models/customerModel");

//loading tfjs for faster performance
require("@tensorflow/tfjs-node");

const faceapi = require("@vladmandic/face-api");
const { Canvas, Image } = require("canvas");
const canvas = require("canvas");
const faceMatcher = require("../utils/face-matcher");

faceapi.env.monkeyPatch({ Canvas, Image });

exports.uploadLabeledImages = async (images) => {
  const descriptions = [];

  for (let i = 0; i < images.length; i++) {
    if (images[i]) {
      const img = await canvas.loadImage(images[i]);
      const detections = await faceapi
        .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptions.push(detections.descriptor);
    }
  }
  return descriptions;
};

exports.getDescriptorsFromDB = async (detectionDescriptor, req, res) => {
  faceMatcher(detectionDescriptor, res);
};

exports.getDescriptorsFromDB1 = async (detectionDescriptor) => {
  const faces = await customerModel.find(
    {},
    { customer_img_label: 1, customer_img_descriptions: 1 }
  );
  for (i = 0; i < faces.length; i++) {
    for (j = 0; j < faces[i].customer_img_descriptions.length; j++) {
      faces[i].customer_img_descriptions[j] = new Float32Array(
        Object.values(faces[i].customer_img_descriptions[j])
      );
    }

    faces[i] = new faceapi.LabeledFaceDescriptors(
      faces[i].customer_img_label,
      faces[i].customer_img_descriptions
    );
  }
  const displaySize = {
    width: 640,
    height: 480,
  };

  const faceMatcher = new faceapi.FaceMatcher(faces);

  const resizedDetections = faceapi.resizeResults(
    detectionDescriptor,
    displaySize
  );

  const results = faceMatcher.findBestMatch(
    new Float32Array(Object.values(resizedDetections))
  );

  return results;
};
