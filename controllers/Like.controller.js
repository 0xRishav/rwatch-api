const userDb = require("../models/user.model");

module.exports.getAllLikedVideos = async (req, res) => {
  const user = req.user;
  try {
    const populatedUser = await userDb
      .findById(user._id)
      .populate("likedVideos")
      .populate("history")
      .populate({ path: "playlists", populate: { path: "videos" } });

    if (populatedUser) {
      return res.status(200).json({ success: true, data: populatedUser });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "User not autherised" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.addToLikedVideos = async (req, res) => {
  const { videoId } = req.params;
  let user = req.user;
  try {
    const likedVideos = user.likedVideos;
    if (!likedVideos.some((video) => video == videoId)) {
      user.likedVideos.push(videoId);
      await user.save();
      const populatedUser = await userDb
        .findById(user._id)
        .populate("likedVideos")
        .populate("history")
        .populate({ path: "playlists", populate: { path: "videos" } });
      if (populatedUser) {
        return res.status(200).json({ success: true, data: populatedUser });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "User not autherised" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "video already liked" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.removeFromLikedVideos = async (req, res) => {
  const { videoId } = req.params;
  let user = req.user;
  try {
    if (user.likedVideos.includes(videoId)) {
      await user.update({ $pull: { likedVideos: videoId } });
      const populatedUser = await userDb
        .findById(user._id)
        .populate("likedVideos")
        .populate("history")
        .populate({ path: "playlists", populate: { path: "videos" } });
      if (populatedUser) {
        return res.status(200).json({ success: true, data: populatedUser });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "User not autherised" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "video is not liked" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};
