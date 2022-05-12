const { OAuth2Client } = require("google-auth-library");
const { catchAsync } = require("../utils/catchAsync");

const client = new OAuth2Client(process.env.CLIENT_ID);
const employeeModel = require("../models/employeeModel");

exports.login_google = catchAsync(async (req, res, next) => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const worker = await employeeModel.findOne({ employee_email: payload.email });

  if (!worker || !payload) {
    res.status(404).send({
      status: "Register through your manager first!",
    });
    return;
  }

  res.cookie("google-jwt", req.body.idToken);
  res.status(200).json({
    status: "Login Successful",
    user: {
      email: payload.email,
      picture: payload.picture,
      name: payload.name,
      designation: worker.employee_designation,
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
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please log in to get access",
    });
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const worker = await employeeModel.findOne({ employee_email: payload.email });

  req.employee = worker;
  console.log(worker);
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(roles[0], roles[1]);
    console.log(req.employee.employee_designation);
    if (!roles.includes(req.employee.employee_designation)) {
      //403 is for forbidden
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
