require("dotenv").config();
const mongoose = require("mongoose");
require("mongoose-type-email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = process.env;

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: ["name is required"],
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      required: ["email is required"],
    },
    password: {
      type: String,
      required: ["password can't be empty"],
    },
    likedVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    playlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
    history: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },

  {
    timestamps: true,
  }
);

userSchema.methods = {
  createAccessToken: async function () {
    try {
      let user = this;
      let accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET);
      return accessToken;
    } catch (err) {
      console.log(err);
      return;
    }
  },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
