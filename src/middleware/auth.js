const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
  try {
    // ✅ Safely access the token
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).send("Please login...!");
    }

    // ✅ Decode the token
    const decoded = jwt.verify(token, "DEV@tinder123");

    // ✅ Use _id because that's how it's signed
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





module.exports = {userAuth}