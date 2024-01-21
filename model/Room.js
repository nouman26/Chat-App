var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          unique: true,
          trim: true
     },
}, {timestamps: true});

var User = mongoose.model("room", UserSchema);
module.exports = User;