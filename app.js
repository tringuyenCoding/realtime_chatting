import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server);
app.use(express.static(path.join(__dirname, "public")));

let socketsConnected = new Set();

io.on("connect", onConnected);

function onConnected(socket) {
  console.log(`Socket ${socket.id} connected`);
  socketsConnected.add(socket.id);

  io.emit("clients-total", socketsConnected.size);

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });
}
