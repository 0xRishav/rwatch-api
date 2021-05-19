const express = require("express");
const app = express();
var cors = require("cors");
const router = express.Router();

app.use(cors());

// Controllers
const videoController = require("../controllers/Video.controller");
const userController = require("../controllers/User.controller");
const likedController = require("../controllers/Like.controller");
const historyController = require("../controllers/history.controller");
const playlistController = require("../controllers/Playlist.controller");

// Video router
router.get("/video", videoController.getAllVideos);
router.get("/video/:videoId", videoController.getVideoById);

// User router
router.post("/user/signup", userController.signUpUser);
router.post("/user/signin", userController.signInUser);

// Liked Videos routes
router.get("/likes/:userId", likedController.getAllLikedVideos);
router.post("/likes/add/:userId/:videoId", likedController.addToLikedVideos);
router.post(
  "/likes/remove/:userId/:videoId",
  likedController.removeFromLikedVideos
);

// History routes
router.get("/history/:userId", historyController.getHistory);
router.post("/history/add/:userId/:videoId", historyController.addToHistory);
router.post(
  "/history/remove/:userId/:videoId",
  historyController.removeFromHistory
);
router.post("/history/reset/:userId", historyController.resetHistory);

// Playlist routes
router.get("/playlist/:userId", playlistController.getAllPlaylists);
router.post("/playlist/new/:userId", playlistController.addNewPlaylist);
router.post(
  "/playlist/:userId/delete/:playlistId",
  playlistController.deletePlaylist
);
router.post(
  "/playlist/:playlistId/add/:videoId",
  playlistController.addVideoToPlaylist
);
router.post(
  "/playlist/:playlistId/remove/:videoId",
  playlistController.removeVideoFromPlaylist
);

module.exports = router;

