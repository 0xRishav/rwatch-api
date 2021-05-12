const express = require("express");
const app = express();

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  return res.json({ success: true, message: "server is up and running" });
});
app.get("/about", (req, res) => {
  return res.json({ success: true, message: "server is up and running" });
});

app.listen(PORT, (req, res) => {
  console.log(`Express app is running on port: ${PORT}`);
});
