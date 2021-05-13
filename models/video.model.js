const mongoose = require("mongoose");

const { Schema } = mongoose;

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: ["Video title is required"],
    },
    organiser: {
      type: String,
      required: ["organiser title is required"],
    },
    description: {
      type: String,
      required: ["description title is required"],
    },
    isLatest: {
      type: Boolean,
      required: ["isLatest title is required"],
    },
    videoId: {
      type: String,
      required: ["videoId title is required"],
    },
    videoUrl: {
      type: String,
      required: ["videoUrl title is required"],
    },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
