const userDb = require("../models/user.model");

module.exports.getAllLikedVideos = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userDb.findById(userId);
    const data = await user.execPopulate("likedVideos");
    return res.status(200).json({ success: true, data: [...data.likedVideos] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.addToLikedVideos = async (req, res) => {
  const { userId, videoId } = req.params;
  try {
    const user = await userDb.findById(userId);
    const likedVideos = user.likedVideos;
    if (!likedVideos.some((video) => video == videoId)) {
      user.likedVideos.push(videoId);
      await user.save();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "video already liked" });
    }

    const data = await user.execPopulate("likedVideos");
    return res.status(200).json({ success: true, data: [...data.likedVideos] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.removeFromLikedVideos = async (req, res) => {
  const { userId, videoId } = req.params;
  try {
    let user = await userDb.findById(userId);
    if (user.likedVideos.includes(videoId)) {
      await user.update({ $pull: { likedVideos: videoId } });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "video is not liked" });
    }

    const newUser = await userDb.findById(userId);
    const data = await newUser.execPopulate("likedVideos");
    return res.status(200).json({ success: true, data: [...data.likedVideos] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};
