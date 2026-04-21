import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";

export default function ChatPage() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    const [username, setUsername] = useState("");
    const [isJoined, setIsJoined] = useState(false);

    const chatEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [typingUser, setTypingUser] = useState("");

    // Receive messages
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setChat((prev) => [...prev, data]);
        });

        socket.on("typing", (username) => {
            setTypingUser(username);
        });

        socket.on("stop_typing", () => {
            setTypingUser("");
        });

        return () => {
            socket.off("receive_message");
            socket.off("typing");
            socket.off("stop_typing");
        };
    }, []);

    // Auto scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    // Send message
    const sendMessage = () => {
        if (!message) return;

        const msgData = {
            message,
            time: new Date().toLocaleTimeString(),
            sender: socket.id,
            username: username,
        };

        socket.emit("send_message", msgData);
        setMessage("");
    };

    // Join screen
    if (!isJoined) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="border p-6 rounded shadow w-80 bg-white">
                    <h2 className="text-xl mb-4 text-center font-semibold">
                        Enter Username
                    </h2>

                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (!username.trim()) {
                                    alert("Enter username");
                                    return;
                                }
                                setIsJoined(true);
                            }
                        }}
                        className="border p-2 w-full mb-4 rounded"
                        placeholder="Your name"
                    />
                    <button
                        onClick={() => {
                            if (!username.trim()) return alert("Enter Username")
                            setIsJoined(true)
                        }}
                        className="bg-blue-500 text-white w-full py-2 rounded"
                    >
                        Join Chat
                    </button>
                </div>
            </div>
        );
    }

    // Chat UI
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 text-lg font-semibold">
                Chat App
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {chat.length === 0 && (
                    <p className="text-center text-gray-500">
                        No messages yet 👋
                    </p>
                )}

                {chat.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-3 ${msg.sender === socket.id ? "text-right" : "text-left"
                            }`}
                    >
                        <p className="text-xs text-gray-500">{msg.username}</p>

                        <div
                            className={`inline-block px-3 py-2 rounded-lg ${msg.sender === socket.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300"
                                }`}
                        >
                            {msg.message}
                        </div>

                        <div className="text-xs text-gray-400">
                            {msg.time}
                        </div>
                    </div>
                ))}

                <div ref={chatEndRef} />
            </div>
            {/* Typing indicator */}

            {typingUser && (
                <div className="text-sm text-gray-500 px-4 flex items-center gap-1">
                    <span>{typingUser} is typing</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                </div>
            )}
            {/* Input */}
            <div className="p-3 flex gap-2 bg-white">
                <input
                    value={message}
                    onChange={(e) => {
                        const val = e.target.value;
                        setMessage(val);

                        socket.emit("typing", username);

                        clearTimeout(typingTimeoutRef.current);

                        typingTimeoutRef.current = setTimeout(() => {
                            socket.emit("stop_typing");
                        }, 1500);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    className="border p-2 flex-1 rounded"
                    placeholder="Type message..."
                />
                <button
                    onClick={sendMessage}
                    disabled={!message}
                    className="bg-blue-500 text-white px-4 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}