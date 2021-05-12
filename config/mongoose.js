const mongoose = require("mongoose");

const uri =
  "mongodb+srv://rishavbharti:CdBFYLrAP1HsqgPN@rwatch.67eqj.mongodb.net/test";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoose connection successful"))
  .catch((err) => console.log("mongoose connection failed", err));

const db = mongoose.connection;
