var Model = require("../model/index");

exports.login = [
     async function (req, res) {
         try {
               res.render("login");
          }
          catch (err) {
               console.log(err);
               res.redirect("/error");
          }
     }
];

exports.option = [
     async function (req, res) {
          try {
               var email = req.body.email;
               var userName = req.body.userName;
               let user = await Model.User.findOne({ email: email }).lean();
               if(user) {
                    await Model.User.updateOne({email: email}, {online: true});
               }
               else {
                    await new Model.User({email: email, userName: userName, online: true}).save();
               }
               let users = await Model.User.find({online: true}).lean();
               let rooms = await Model.Room.find({}).lean();
               res.render("select", {users, rooms, userName, email});
          }
          catch (err) {
               console.log(err);
               res.redirect("/error");
          }
     }
];

exports.chat = [
     async function (req, res) {
          try {
               let room;
               if(req.body.optionType == "createRoom") {
                    await new Model.Room({name: req.body.roomName}).save();
                    room = req.body.roomName
               }
               else if(req.body.optionType == "rooms") {
                    room = req.body.room
               }
               res.render("chat", {userName:req.body.userName, email: req.body.email, room: room});
          }
          catch (err) {
               console.log(err);
               res.redirect("/error");
          }
     }
];

exports.error = [
     async function (req, res) {
          try {
               res.render("error");
          }
          catch (err) {
               console.log(err);
               res.redirect("/");
          }
     }
];