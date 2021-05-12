const mongoose = require("mongoose");

const { Schema } = mongoose;

const historyVideoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    historyVideo: {
      video: mongoose.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

const HistoryVideo = model("HistoryVideo", historyVideoSchema);
module.exports = HistoryVideo;
