import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

// ✅ Custom hook — all socket logic lives here, not in the component
export function useSocket(username) {
    const [chat, setChat] = useState([]);
    const [typingUser, setTypingUser] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        // Announce joining when username is set
        if (username) {
            socket.emit("user_join", username);
        }

        socket.on("receive_message", (data) => {
            setChat((prev) => [...prev, data]);
        });

        socket.on("typing", (user) => {
            setTypingUser(user);
        });

        socket.on("stop_typing", () => {
            setTypingUser("");
        });

        socket.on("online_users", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off("receive_message");
            socket.off("typing");
            socket.off("stop_typing");
            socket.off("online_users");
        };
    }, [username]);

    // Send a message
    const sendMessage = (message) => {
        if (!message.trim()) return;

        const msgData = {
            id: `${socket.id}-${Date.now()}`, // ✅ unique id, not array index
            message,
            time: new Date().toLocaleTimeString(),
            sender: socket.id,
            username,
        };

        socket.emit("send_message", msgData);
    };

    // Handle typing events with debounce
    const handleTyping = () => {
        socket.emit("typing", username);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing");
        }, 1500);
    };

    return { chat, typingUser, onlineUsers, sendMessage, handleTyping };
}
