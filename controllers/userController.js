const userModel = require("../models/userModel");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

exports.login_google = async (req, res) => {
  try {
    console.log(req.body);
    const ticket = await client.verifyIdToken({
      idToken: req.body.session.idToken,
      audience: process.env.CLIENT_ID,
    });
    console.log(ticket);
    const payload = ticket.getPayload();
    console.log(payload);
    // const userid = payload["sub"];
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "Login Failed!",
      message: err,
    });
  }
};