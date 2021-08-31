const playlistDb = require("../models/playlist.model");
const userDb = require("../models/user.model");

module.exports.getAllPlaylists = async (req, res) => {
  const user = req.user;
  try {
    const { playlists } = await userDb
      .findById(user._id)
      .populate({ path: "playlists", populate: "videos" });
    const newPlaylist = playlists.filter((playlist) => playlist.active);

    return res.status(200).json({ success: true, data: [...newPlaylist] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.addNewPlaylist = async (req, res) => {
  let { user } = req;
  const { name } = req.body;
  try {
    const playlist = await playlistDb.create({
      name: name,
      user: user._id,
      active: true,
    });
    user.playlists.push(playlist._id);
    await user.save();

    if (playlist) {
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
        .status(500)
        .json({ success: false, message: "error in creating playlist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error please try later",
    });
  }
};

module.exports.deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const user = req.user;
  try {
    const playlist = await playlistDb.findById(playlistId);
    const updatedPlaylist = await playlist.updateOne({ active: false });
    const { playlists } = await (
      await userDb.findById(user._id)
    ).execPopulate({ path: "playlists", populate: { path: "videos" } });
    const newPlaylist = playlists.filter((playlist) => playlist.active);
    user.playlists = newPlaylist;
    await user.save();
    if (updatedPlaylist) {
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
        .json({ success: false, message: "error in deleting the playlist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error please try again after sometime",
    });
  }
};

module.exports.addVideoToPlaylist = async (req, res) => {
  const { playlistId, videoId } = req.params;
  const user = req.user;
  try {
    const playlist = await playlistDb.findById(playlistId);
    const userId = playlist.user;
    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "video already exists in playlist",
      });
    }
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
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error please try again after sometime",
    });
  }
};

module.exports.removeVideoFromPlaylist = async (req, res) => {
  const { playlistId, videoId } = req.params;
  const user = req.user;
  try {
    const playlist = await playlistDb.findById(playlistId);
    const userId = playlist.user;
    await playlistDb.findByIdAndUpdate(playlistId, {
      $pull: { videos: videoId },
    });
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
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "internal error please try again later",
    });
  }
};
