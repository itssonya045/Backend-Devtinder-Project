const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // ✅ Allow preflight request to pass
    if (req.method === "OPTIONS") {
      return next();
    }

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).send("Please login...!");
    }

    const decoded = jwt.verify(token, "DEV@tinder123");
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};

module.exports = { userAuth };
