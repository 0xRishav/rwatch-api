const userDb = require("../models/user.model");

module.exports.getHistory = async (req, res) => {
  const user = req.user;
  try {
    const populatedUser = await userDb
      .findById(user._id)
      .populate("history")
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

module.exports.addToHistory = async (req, res) => {
  const { videoId } = req.params;
  let user = req.user;
  try {
    const history = user.history;
    if (!history.some((video) => video == videoId)) {
      history.push(videoId);
      await user.save();
      const populatedUser = await userDb
        .findById(user._id)
        .populate("history")
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

module.exports.removeFromHistory = async (req, res) => {
  const { videoId } = req.params;
  let user = req.user;
  try {
    if (user.history.includes(videoId)) {
      await user.update({ $pull: { history: videoId } });
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
        .json({ success: false, message: "video never watched" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.resetHistory = async (req, res) => {
  let user = req.user;
  try {
    user.history = [];
    await user.save();
    const populatedUser = await userDb
      .findById(user._id)
      .populate("history")
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
