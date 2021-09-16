const { response } = require("express");
const videodb = require("../models/video.model");

module.exports.getAllVideos = async (req, res) => {
  try {
    const videos = await videodb.find();
    if (videos) {
      return res.status(200).json({ success: true, videos });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "videos not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

module.exports.getVideoById = async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await videodb.findById(videoId);
    if (video) {
      return res.status(200).json({ success: true, video });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "video not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};
