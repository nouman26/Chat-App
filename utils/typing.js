let users = [];

function addTypingUser(user,room) {
     if(users.filter((u) => u.user === user).length > 0) {
          return;
     }
     else{
          users.push({user,room});
     } 
}

function removeTypingUser(user) {
     users = users.filter((u) => u.user !== user);
}

function getTypingUser(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { addTypingUser, removeTypingUser, getTypingUser};
