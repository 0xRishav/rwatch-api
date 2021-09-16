require("dotenv").config();
const userDb = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

module.exports.signUpUser = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await userDb.findOne({ email: email });
  try {
    if (user) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }
    if (
      name &&
      email &&
      new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email) &&
      password
    ) {
      let salt = await bcrypt.genSalt(12);
      let hashedPassword = await bcrypt.hash(password, salt);
      const userObj = {
        email: email,
        name: name,
        password: hashedPassword,
      };
      user = await new userDb(userObj).save();
      let accessToken = await user.createAccessToken();
      if (user) {
        return res.status(200).json({
          success: true,
          message: "User added successfully",
          data: { accessToken, user },
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "please enter valid email",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(503)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.signInUser = async (req, res) => {
  const { email, password } = req.body;
  let user = null;
  try {
    if (
      email &&
      new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email) &&
      password
    ) {
      user = await userDb
        .findOne({ email: email })
        .populate("likedVideos")
        .populate("history")
        .populate({ path: "playlists", populate: "videos" });

      if (user) {
        if (bcrypt.compare(password, user.password)) {
          const accessToken = await user.createAccessToken();
          return res.status(200).json({
            message: "SignIn successfull",
            data: { accessToken, user },
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "Incorrect Password",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "email or password invalid",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      success: false,
      message: "internal server error",
    });
  }
};
