const express = require("express");
const app = express();
var cors = require("cors");
const router = express.Router();

app.use(cors());

const middlewrares = require("../middlewares");

// Controllers
const videoController = require("../controllers/Video.controller");
const userController = require("../controllers/User.controller");
const likedController = require("../controllers/Like.controller");
const historyController = require("../controllers/history.controller");
const playlistController = require("../controllers/Playlist.controller");

// Video router
router.get("/video", videoController.getAllVideos);
router.get(
  "/video/:videoId",
  middlewrares.checkAuth,
  videoController.getVideoById
);

// User router
router.post("/user/signup", userController.signUpUser);
router.post("/user/signin", userController.signInUser);

// Liked Videos routes
router.get("/likes", middlewrares.checkAuth, likedController.getAllLikedVideos);
router.post(
  "/likes/add/:videoId",
  middlewrares.checkAuth,
  likedController.addToLikedVideos
);
router.post(
  "/likes/remove/:videoId",
  middlewrares.checkAuth,
  likedController.removeFromLikedVideos
);

// History routes
router.get("/history", middlewrares.checkAuth, historyController.getHistory);
router.post(
  "/history/add/:videoId",
  middlewrares.checkAuth,
  historyController.addToHistory
);
router.post(
  "/history/remove/:videoId",
  middlewrares.checkAuth,
  historyController.removeFromHistory
);
router.post(
  "/history/reset",
  middlewrares.checkAuth,
  historyController.resetHistory
);

// Playlist routes
router.get(
  "/playlist",
  middlewrares.checkAuth,
  playlistController.getAllPlaylists
);
router.post(
  "/playlist/new",
  middlewrares.checkAuth,
  playlistController.addNewPlaylist
);
router.post(
  "/playlist/delete/:playlistId",
  middlewrares.checkAuth,
  playlistController.deletePlaylist
);
router.post(
  "/playlist/:playlistId/add/:videoId",
  middlewrares.checkAuth,
  playlistController.addVideoToPlaylist
);
router.post(
  "/playlist/:playlistId/remove/:videoId",
  middlewrares.checkAuth,
  playlistController.removeVideoFromPlaylist
);

module.exports = router;
