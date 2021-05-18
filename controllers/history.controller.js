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
      await user.history.push(videoId);
      await user.save();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "video already liked" });
    }

    const data = await user.execPopulate("history");
    return res.status(200).json({ success: true, data: [...data.history] });
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
    } else {
      return res
        .status(400)
        .json({ success: false, message: "video is not liked" });
    }

    const newUser = await userDb.findById(userId);
    const data = await newUser.execPopulate("history");
    return res.status(200).json({ success: true, data: [...data.history] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

module.exports.resetHistory = async (req, res) => {
  console.log("inside history controller")
  const { userId } = req.params;
  try {
    let user = await userDb.findById(userId);
    console.log("found user", user.email);
    user.history = [];
    console.log("updated history", user.history);
    await user.save();

    console.log("saved user", user.history);

    const data = await user.execPopulate("history");
    console.log("populated data");
    return res.status(200).json({ success: true, data: [...data.history] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};
