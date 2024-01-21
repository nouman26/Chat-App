const socket = io();

const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
document.addEventListener("DOMContentLoaded", function() {
  let user = document.getElementById("user").value;
  let email = document.getElementById("email").value;
  let room = document.getElementById("room").value;
  socket.emit("joinRoom", { username:user, room, email});
});


socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("usersTyping", ({ room, users }) => {
  let user = document.getElementById("user").value;
  let typingUsers = users.filter((u) => u.user !== user);
  document.getElementById("typter").innerText = typingUsers.length > 0 ? typingUsers.map((u) => u.user).join(",") + " is typing..." : "";
});

socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Fetch the radio button element by its name
  var radioElement = document.querySelector('input[name="optionType"]:checked');
  
  const message = e.target.elements.msg.value;
  let to = radioElement.value;
  socket.emit("chatMessage", {message,to:to == "all" ? undefined : to});
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  let user = document.getElementById("user").value;
  const div = document.createElement("div");
  div.classList.add("message");
  let type = message.type == "private" ? "(Only visible to "+(message.to == user ? "you)":message.to+")" ) : ""
  div.innerHTML = `<p class="meta">${message.username}<span>  ${message.time}  ${type}</span></p>
                    <p class="text">
                        ${message.text}
                    </p>
                    `;
  document.querySelector(".chat-messages").appendChild(div);
}

function keyPress(){
  let user = document.getElementById("user").value;
  let room = document.getElementById("room").value;
  let text = document.getElementById("msg").value;
  if(text.length > 0){
    socket.emit("usertyping", {user, room});
  }
  else{
    socket.emit("usernottyping", {user, room});
  }
}
setInterval(keyPress, 1000);

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  let cuser = document.getElementById("user").value;
  let otherUsers = [`
  <div style="display: flex; flex-direction: row; margin-bottom:10px">
                            <input style="margin-bottom: 3px; margin-right: 5px;" type="radio" name="optionType"
                                value="all" id="roomsRadio" checked="checked">
                            <label>In Room</label>
                        </div>`];
  users.forEach((user) => {
    if(cuser !== user.username){
      otherUsers.push(`<div style="display: flex; flex-direction: row; margin-bottom:10px">
                            <input style="margin-bottom: 3px; margin-right: 5px;" type="radio" name="optionType"
                                value="${user.username}" id="roomsRadio">
                            <label>${user.username}</label>
                        </div>
    `)
    }
  })

  userList.innerHTML = otherUsers.join("");
}
