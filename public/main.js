const socket = io();

const clientsTotal = document.getElementById("clients-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form")

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});


socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total clients: ${data}`;
});

function sendMessage() {
  console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    datetime: new Date(),
  }
  socket.emit('message',data);
}

socket.on('chat-message', (data) => {
  console.log(data);
});