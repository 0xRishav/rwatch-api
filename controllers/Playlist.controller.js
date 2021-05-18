const playlistDb = require("../models/playlist.model");
const userDb = require("../models/user.model");

module.exports.getAllPlaylists = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userDb.findById(userId);
    console.log("usr Playlist", user.playlists);
    const { playlists } = await (
      await userDb.findById(userId)
    ).execPopulate({ path: "playlists", populate: { path: "videos" } });
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
  const { userId } = req.params;
  const { name } = req.body;
  try {
    const playlist = await playlistDb.create({
      name: name,
      user: userId,
      active: true,
    });
    const user = await userDb.findById(userId);
    user.playlists.push(playlist._id);
    await user.save();
    const { playlists } = await user.execPopulate({ path: "playlists", populate: { path: "videos" } });
    const newPlaylist = playlists.filter((playlist) => playlist.active);

    if (playlist) {
      return res.status(200).json({
        success: true,
        message: "playlist added successfully",
        data: [...newPlaylist],
      });
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
  const { playlistId, userId } = req.params;
  try {
    const playlist = await playlistDb.findById(playlistId);
    const updatedPlaylist = await playlist.updateOne({ active: false });
    const { playlists } = await (
      await userDb.findById(userId)
    ).execPopulate({ path: "playlists", populate: { path: "videos" } });
    const newPlaylist = playlists.filter((playlist) => playlist.active);
    return res.status(200).json({ success: true, data: [...newPlaylist] });
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
  try {
    const playlist = await playlistDb.findById(playlistId);
    const userId = playlist.user;
    console.log("PLAYLIST", playlist);
    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      playlist.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "video already exists in playlist",
      });
    }
    const { playlists } = await (
      await userDb.findById(userId)
    ).execPopulate({ path: "playlists", populate: { path: "videos" } });
    const newPlaylist = playlists.filter((playlist) => playlist.active);
    return res.json({ success: true, data: [...newPlaylist] });
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
  try {
    const playlist = await playlistDb.findById(playlistId);
    const userId = playlist.user;
    await playlistDb.findByIdAndUpdate(playlistId, {
      $pull: { videos: videoId },
    });
    const { playlists } = await (
      await userDb.findById(userId)
    ).execPopulate({ path: "playlists", populate: { path: "videos" } });
    const newPlaylist = playlists.filter((playlist) => playlist.active);
    return res.status(201).json({
      sucess: true,
      data: [...newPlaylist],
      message: "video removed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "internal error please try again later",
    });
  }
};
