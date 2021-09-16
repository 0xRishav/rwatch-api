require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { ACCESS_TOKEN_SECRET } = process.env;

exports.checkAuth = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing!" });
  } else {
    try {
      const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const user = await User.findOne({ _id: payload.id });
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session timed out,please login again" });
      } else if (error.name === "JsonWebTokenError") {
        return res
          .status(403)
          .json({ message: "Token expired, Please login again" });
      } else {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Internal Server Error!", error: error });
      }
    }
  }
};
