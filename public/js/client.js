const socket = io();

var username;
let chats = document.querySelector(".chats");
let users_list = document.querySelector(".users-list");
let user_count = document.querySelector(".users-count");
let msg_send = document.getElementById("user-send");
let user_msg = document.getElementById("user-msg");

do {
  username = prompt("Enter you name: ");
} while (!username);

// It will be called when you will join
socket.emit("new-user-joined", username);

// Notifying that user is joined
socket.on("user-connected", (socket_name) => {
  userJoinLeft(socket_name, "joined");
});

// Function to create joined/left status
function userJoinLeft(name, status) {
  let div = document.createElement("div");
  div.classList.add("user-join");
  let content = `<p> <b>${name}</b> ${status} the chat</p>`;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight;
}

// Notifying that user is left
socket.on("user-disconnected", (user) => {
  userJoinLeft(user, "left");
});

// To update user list and user count
socket.on("user-list", (users) => {
  users_list.innerHTML = "";
  users_arr = Object.values(users);

  let len = users_arr.length;
  for (let i = 0; i < len; i++) {
    let p = document.createElement("p");
    p.innerHTML = users_arr[i];
    users_list.appendChild(p);
  }
  user_count.innerHTML = len;
});

// for sending message
const sendMessage = function () {
  let data = {
    user: username,
    msg: user_msg.value,
  };
  if (user_msg.value != "") {
    appendMessage(data, "outgoing");
    socket.emit("message", data);
    user_msg.value = "";
  }
}

msg_send.addEventListener("click", () => {
  sendMessage();
});

// if enter button is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function appendMessage(data, status) {
  let div = document.createElement("div");
  div.classList.add("message", status);
  let client = (status === 'outgoing') ? 'You' : data.user;
  let content = `
    <h5>${client}</h5>
    <p>${data.msg}</p>
    `;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight;
}

socket.on("message", (data) => {
  appendMessage(data, "incoming");
});