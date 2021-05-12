const mongoose = require("mongoose");

const { Schema } = mongoose;

const likedVideoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likedVideo: {
      video: mongoose.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

const LikedVideo = model("LikedVideo", likedVideoSchema);
module.exports = LikedVideo;
