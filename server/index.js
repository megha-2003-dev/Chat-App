const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", (data) => {
        io.emit("receive_message", data); // ✅ send to ALL
    });

    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });
    
    socket.on("stop_typing", () => {
        socket.broadcast.emit("stop_typing");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});