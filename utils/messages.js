const moment = require("moment");
const Model = require("../model/index");
async function formatMessage(username, text, room, to) {
  let temp = {
      from: username,
      text,
      room,
      time: moment().format("h:mm a"),
  }
  if(to) {
      temp.to = to;
  }

  await new Model.Chat(temp).save();

  let temp2 = {
    username,
    text,
    room,
    time: moment().format("h:mm a"),
  }
  if(to) {
      temp2.to = to;
      temp2.type = "private";
  }
  else {
    temp2.type = "public";
  }
  return temp2;
}

module.exports = formatMessage;
