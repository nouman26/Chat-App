var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var chatSchema = new mongoose.Schema({
     from : {type: String}, 
     to : {type: String}, 
     text : {type: String},
     room : {type: String},
     time:  {type: String},
}, {timestamps: true});

var chat = mongoose.model("chat", chatSchema);
module.exports = chat;