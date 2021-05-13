const express = require("express");
const cors = require("cors");
const db = require("./config/mongoose");
const app = express();
const router = require("./routes");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use("/", router);

const videoController = require("./controllers/Video.controller");

app.get("/", (req, res) => {
  return res.send("RWatch API");
});

app.listen(PORT, (req, res) => {
  console.log(`Express app is running on port: ${PORT}`);
});
