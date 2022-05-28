const recombee = require("recombee-api-client");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//inorder to reduce data redundancy, I've stored all inventory data in rocombee's database
const rqs = recombee.requests;
var client = new recombee.ApiClient(
  "salesmigo-dev",
  "U9ayxV5T070epnczI9MqK5lyBCbK6AdBg3RYkcQfOH3AizmIll7YkDM0L8bn77av",
  { region: "us-west" }
);

//adding items to our database/inventory
exports.AddItemsToInventory = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    price,
    categories,
    color,
    monthOfPurchase,
    locationOfStocking,
    image,
    gender,
    aisle,
    material,
  } = req.body;

  const addItemProperties = await new rqs.SetItemValues(
    title.replace(/ /g, ""),
    {
      title,
      description,
      color,
      price,
      categories,
      month: monthOfPurchase,
      location: locationOfStocking,
      image,
      gender,
      aisle,
      material,
    },
    {
      cascadeCreate: true,
    }
  );

  addItemProperties.timeout = 5000;

  client.send(addItemProperties, (err, response) => {
    if (err !== null) {
      console.log(err);
      return next(new AppError(`Item ${title} not added : ${err}`, 404));
    }
    if (response) {
      res.status(200).json({
        status: "Successfully added item",
      });
    }
  });
});

//getting all items from our database/inventory
exports.GetAllItemsInInventory = catchAsync(async (req, res, next) => {
  const getAllItems = new rqs.ListItems({});

  getAllItems.timeout = 5000;

  client.send(getAllItems, (err, response) => {
    if (err !== null) {
      console.log(err);
      return next(new AppError(`Fetching Items Failed`, 404));
    }
    if (response) {
      res.status(200).json({
        status: "Success",
        items: response,
      });
    }
  });
});

//deleting an item from our database/inventory
exports.DeleteItemFromInventory = catchAsync(async (req, res, next) => {
  const { title } = req.body;

  const deleteItem = await new rqs.DeleteItem(title.replace(/ /g, ""));

  deleteItem.timeout = 5000;

  client.send(deleteItem, (err, response) => {
    if (err !== null) {
      console.log(err);
      return next(new AppError(`Item ${itemId} not deleted : ${err}`, 404));
    }
    if (response) {
      res.status(200).json({
        status: "Successfully deleted item",
      });
    }
  });
});

//adding a purchase
exports.AddPurchase = catchAsync(async (req, res, next) => {
  const { emailId, itemId, price } = req.body;
  const addPurchase = new rqs.AddPurchase(emailId, itemId.replace(/ /g, ""), {
    cascadeCreate: true,
    price,
  });

  addPurchase.timeout = 5000;

  client.send(addPurchase, (err, response) => {
    if (err !== null) {
      console.log(err);
      return next(new AppError(`Item ${title} not purchased : ${err}`, 404));
    }
    if (response) {
      res.status(200).json({
        status: "Successfully Purchased item",
      });
    }
  });
});

//getting recommended items for a particular user
exports.RecommendItems = catchAsync(async (req, res, next) => {
  const { emailId, scenario } = req.body;

  const recommendItems = new rqs.RecommendItemsToUser(emailId, 4, {
    returnProperties: true,
    cascadeCreate: true,
    scenario,
  });

  recommendItems.timeout = 5000;

  client.send(recommendItems, (err, recommended) => {
    if (err !== null) {
      console.log(err);
      return next(new AppError(`No recommendation found`, 404));
    }
    if (recommended) {
      res.status(200).json({
        status: "Success",
        recommendedItems: recommended,
      });
    }
  });
});

//get purchases by a user
exports.GetUserPurchases = catchAsync(async (req, res, next) => {
  const emailId = req.params.userId;
  const userPurchases = new rqs.ListUserPurchases(emailId);
  userPurchases.timeout = 5000;

  client.send(userPurchases, (err, purchases) => {
    if (err !== null || purchases.length === 0) {
      console.log(err);
      return next(new AppError(`No purchase of the user found`, 404));
    }
    if (purchases.length > 0) {
      res.status(200).json({
        status: "Success",
        purchases,
      });
    }
  });
});
