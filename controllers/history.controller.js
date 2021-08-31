const userDb = require("../models/user.model");

module.exports.getHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userDb.findById(userId);
    const data = await user.execPopulate("history");
    return res.status(200).json({ success: true, data: [...data.history] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.addToHistory = async (req, res) => {
  const { userId, videoId } = req.params;
  try {
    const user = await userDb.findById(userId);
    const history = user.history;
    if (!history.some((video) => video == videoId)) {
      history.push(videoId);
      await user.save();
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
        .json({ success: false, message: "video already liked" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.removeFromHistory = async (req, res) => {
  const { userId, videoId } = req.params;
  try {
    let user = await userDb.findById(userId);
    if (user.history.includes(videoId)) {
      await user.update({ $pull: { history: videoId } });
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
        .json({ success: false, message: "video is never watched" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.resetHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    let user = await userDb.findById(userId);
    user.history = [];
    await user.save();
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
