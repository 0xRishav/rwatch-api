const mongoose = require("mongoose");
require("mongoose-type-email");

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
        ref: "LikedVideo",
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
        ref: "HistoryVideo",
      },
    ],
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
