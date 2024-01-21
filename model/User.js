var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
     email: {
          type: String,
          required: true,
          unique: true,
          trim: true
     },
     userName: {type: String},
     socketId: {type: String},
     online: {type: Boolean, default: false},
}, {timestamps: true});

var User = mongoose.model("user", UserSchema);
module.exports = User;