const userDb = require("../models/user.model");

module.exports.getAllLikedVideos = async (req, res) => {
  const { userId } = req.params;
  try {
    const populatedUser = userDb
      .findById(userId)
      .populate("likedVideos")
      .populate("history")
      .popuate({ path: "playlists", populate: { path: "videos" } });
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
  const { userId, videoId } = req.params;
  let user;
  try {
    const user = await userDb.findById(userId);
    const likedVideos = user.likedVideos;
    console.log(likedVideos);
    if (!likedVideos.some((video) => video == videoId)) {
      user.likedVideos.push(videoId);
      await user.save();
      const populatedUser = userDb
        .findById(userId)
        .populate("likedVideos")
        .populate("history")
        .popuate({ path: "playlists", populate: { path: "videos" } });
      console.log(populatedUser);
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
  const { userId, videoId } = req.params;
  try {
    let user = await userDb.findById(userId);
    if (user.likedVideos.includes(videoId)) {
      await user.update({ $pull: { likedVideos: videoId } });
      const populatedUser = userDb
        .findById(userId)
        .populate("likedVideos")
        .populate("history")
        .popuate({ path: "playlists", populate: { path: "videos" } });
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
