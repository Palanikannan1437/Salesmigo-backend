const express = require("express");
const aisleRouter = express.Router();

const aisleController = require("../controllers/aisleController");
const recommendationController = require("../controllers/recommendationController");

//creation and getting aisles in our store from db
aisleRouter.route("/").post(aisleController.createAisle);
aisleRouter.route("/").get(aisleController.getAllAisles);

//adding,getting and deleting items in recombee's db
aisleRouter.route("/item").post(recommendationController.AddItemsToInventory);
aisleRouter
  .route("/items")
  .get(recommendationController.GetAllItemsInInventory);
aisleRouter
  .route("/item")
  .delete(recommendationController.DeleteItemFromInventory);

//when user makes a purchase
aisleRouter.route("/purchase").post(recommendationController.AddPurchase);

//getting previous purchases of a user
aisleRouter
  .route("/purchases/:userId")
  .get(recommendationController.GetUserPurchases);

//recommending items to a user based on previous purchases
aisleRouter
  .route("/recommendations")
  .post(recommendationController.RecommendItems);

//recommending items to a user based on previous purchases
aisleRouter
  .route("/recommendations-emotions")
  .post(recommendationController.RecommendItemsBasedOnEmotion);

aisleRouter
  .route("/recommendations-gestures")
  .post(recommendationController.RecommendItemsBasedOnGestures);

module.exports = aisleRouter;
