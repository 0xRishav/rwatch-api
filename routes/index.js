const express = require("express");
const app = express();
var cors = require("cors");
const router = express.Router();

app.use(cors());

// Controllers
const videoController = require("../controllers/Video.controller");
const userController = require("../controllers/User.controller");

// Video router
router.get("/video", videoController.getAllVideos);
router.get("/video/:videoId", videoController.getVideoById);

// User router
router.post("/user/signup", userController.signUpUser);
router.post("/user/signin", userController.signInUser);

module.exports = router;
