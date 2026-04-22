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

// ✅ Health endpoint — prevents Render free tier from sleeping
app.get("/health", (req, res) => {
    res.json({ status: "ok", users: onlineUsers.size });
});

// ✅ Track online users  { socketId -> username }
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ✅ Register user when they join
    socket.on("user_join", (username) => {
        onlineUsers.set(socket.id, username);

        // Broadcast updated online users list to everyone
        io.emit("online_users", Array.from(onlineUsers.values()));

        // Notify others that someone joined
        socket.broadcast.emit("receive_message", {
            id: `system-${Date.now()}`,
            message: `${username} joined the chat`,
            username: "System",
            time: new Date().toLocaleTimeString(),
            sender: "system",
        });
    });

    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
    });

    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    socket.on("stop_typing", () => {
        socket.broadcast.emit("stop_typing");
    });

    // ✅ Clean up on disconnect
    socket.on("disconnect", () => {
        const username = onlineUsers.get(socket.id);
        onlineUsers.delete(socket.id);

        // Notify others
        if (username) {
            io.emit("online_users", Array.from(onlineUsers.values()));
            io.emit("receive_message", {
                id: `system-${Date.now()}`,
                message: `${username} left the chat`,
                username: "System",
                time: new Date().toLocaleTimeString(),
                sender: "system",
            });
        }

        console.log("User disconnected:", username || socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ✅ Keep-alive ping — stops Render from sleeping (every 14 mins)
// Replace with your actual Render URL after deploying
const RENDER_URL = process.env.RENDER_URL;
if (RENDER_URL) {
    setInterval(() => {
        fetch(`${RENDER_URL}/health`)
            .then(() => console.log("Keep-alive ping sent"))
            .catch(() => console.log("Keep-alive ping failed"));
    }, 14 * 60 * 1000);
}
