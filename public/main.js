const socket = io();

const clientsTotal = document.getElementById("clients-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total clients: ${data}`;
});

function sendMessage() {
  if (messageInput.value === "") return;
  console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    datetime: new Date(),
  };
  console.log("sendMessage");
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
    <li class= "${isOwnMessage ? "message-right" : "message-left"}">
          <p class="message">
            ${data.message}
          </p><span>${data.name} ● ${moment(data.datetime).fromNow()}</span>
    </li>
    `;
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message...`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message...`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `
        <li class="message-feedback">
          <p id="feedback" class="feedback">${data.feedback}</p>
        </li>
        `;

  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach(e =>{
    e.parentNode.removeChild(e);
  })
}
