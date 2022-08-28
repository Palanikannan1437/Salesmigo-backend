const { OAuth2Client } = require("google-auth-library");
const catchAsync = require("../utils/catchAsync");

const client = new OAuth2Client(process.env.CLIENT_ID);
const employeeModel = require("../models/employeeModel");
const AppError = require("../utils/appError");

exports.login_google = catchAsync(async (req, res, next) => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const worker = await employeeModel.findOne({ employee_email: payload.email });

  if (!worker || !payload) {
    return next(new AppError("Register through your manager first!", 404));
  }

  return res.status(200).json({
    status: "Login Successful",
    employee: {
      email: payload.email,
      picture: payload.picture,
      name: payload.name,
      designation: worker.employee_designation,
      teamId: worker.employee_teamID,
      id: worker["_id"],
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const worker = await employeeModel.findOne({ employee_email: payload.email });

  req.employee = worker;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.employee.employee_designation)) {
      //403 is for forbidden
      return new AppError(
        "You do not have permission to perform this action",
        403
      );
    }
    next();
  };
};
