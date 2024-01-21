const mongoose = require("mongoose");
module.exports = {
  connect: (cb) => {
    const dbUrl = "mongodb://localhost:27017/freechat";
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on("error", () => {
      console.error.bind(console, "MongoDb connection error.");
      return cb(false);
    });
    console.log("Connected!");
    return cb(true);
  },
};
