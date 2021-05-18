const mongoose = require("mongoose");

const { Schema } = mongoose;

const likedVideoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likedVideo: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

const LikedVideo = mongoose.model("LikedVideo", likedVideoSchema);
module.exports = LikedVideo;
