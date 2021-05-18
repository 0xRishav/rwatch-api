const mongoose = require("mongoose");

const { Schema } = mongoose;

const playlistSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: ["playlist name is required"],
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    active: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;
