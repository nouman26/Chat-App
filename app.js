const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
var connection = require("./connection/connection").connect;
const socketio = require("socket.io");
const port = process.env.PORT || 3000;
const routes = require("./routes/index");
app.set('view engine', 'ejs');
const moment = require("moment");
const Model = require("./model/index");

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
  getUser
} = require("./utils/users");

const {
  addTypingUser, removeTypingUser, getTypingUser
} = require("./utils/typing");

const server = http.createServer(app);
const io = socketio(server);
app.set("io", io);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
const botName = "☻ Chat Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    let oldMessages = await Model.Chat.find({ room: user.room, $or:[{to:username},{to:{$exists:false}}] }).sort({createdAt:-1}).limit(10).lean().exec();
    
    if(oldMessages.length > 0){
      oldMessages.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
      oldMessages.forEach((message) => {
        let temp = {...message}
        temp.username = message.from;
        delete temp.from;
        temp.type = temp.to ? "private" : "public";
        socket.emit("message", temp);
      });
    }
    else{
      socket.emit("message", {
        username:botName,
        text:`Welcome to ${user.room}!`,
        room:user.room,
        time: moment().format("h:mm a")
      });  
    }
    
    let joinmessage = await formatMessage(botName, `${user.username} has joined in the chat!`, user.room);
    
    socket.broadcast.to(user.room)
      .emit(
        "message",
        joinmessage
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("usertyping", async (data) => {
    addTypingUser(data.user, data.room);
    let typingUsers = getTypingUser(data.room);
    io.to(data.room).emit("usersTyping", {
      room: data.room,
      users: typingUsers,
    });
  });

  socket.on("usernottyping", async (data) => {
    removeTypingUser(data.user, data.room);
    let typingUsers = getTypingUser(data.room);
    io.to(data.room).emit("usersTyping", {
      room: data.room,
      users: typingUsers,
    });
  });

  socket.on("chatMessage", async (data) => {
    const user = getCurrentUser(socket.id);
    let newmessage = await formatMessage(user.username, data.message, user.room, data.to);
    !data.to ? user.room : data.to
    let toUser = await getUser(data.to);
    if(toUser) {
      io.to([toUser.id,socket.id]).emit("message", newmessage);
    }
    else {
      io.to(user.room).emit("message", newmessage);
    }
  });

  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);
    if (user) {
      let  leftmessage = formatMessage(botName, `${user.username} has left in the chat!`, user.room);
      io.to(user.room).emit(
        "message",
        leftmessage
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// throw main page if URL not found
app.all("*", function(req, res) {
	return res.redirect("/");
});

connection((result) => {
  if (result) {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  }
});