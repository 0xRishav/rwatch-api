const mongoose = require("mongoose");
require("dotenv").config();

const uri = "mongodb+srv://rishavbharti:Gm1581ddnagar@rwatch.67eqj.mongodb.net/RWatch";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoose connection successful"))
  .catch((err) => console.log("mongoose connection failed", err));

const db = mongoose.connection;
