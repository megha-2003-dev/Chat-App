import { useState, useRef, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import OnlineUsers from "../components/OnlineUsers";
import MessageBubble from "../components/MessageBubble";

export default function ChatPage() {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [isJoined, setIsJoined] = useState(false);

    const chatEndRef = useRef(null);

    // ✅ All socket logic lives in the custom hook now
    const { chat, typingUser, onlineUsers, sendMessage, handleTyping } =
        useSocket(isJoined ? username : null);

    // Auto scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleSend = () => {
        if (!message.trim()) return;
        sendMessage(message);
        setMessage("");
    };

    // ——— Join Screen ———
    if (!isJoined) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="border p-6 rounded-xl shadow-md w-80 bg-white">
                    <h2 className="text-xl mb-1 text-center font-bold text-gray-800">
                        Welcome to Chat
                    </h2>
                    <p className="text-sm text-gray-400 text-center mb-5">
                        Enter your name to get started
                    </p>

                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && username.trim()) {
                                setIsJoined(true);
                            }
                        }}
                        className="border p-2 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Your name"
                        autoFocus
                    />
                    <button
                        onClick={() => {
                            if (!username.trim()) return;
                            setIsJoined(true);
                        }}
                        disabled={!username.trim()}
                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white w-full py-2 rounded-lg font-medium transition-colors"
                    >
                        Join Chat
                    </button>
                </div>
            </div>
        );
    }

    // ——— Chat Screen ———
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between shadow">
                <span className="text-lg font-semibold">💬 Chat App</span>
                <span className="text-sm opacity-80">
                    Chatting as <strong>{username}</strong>
                </span>
            </div>

            {/* Main area: messages + online sidebar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4">
                        {chat.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p className="text-4xl mb-2">👋</p>
                                <p className="text-sm">
                                    No messages yet. Say hello!
                                </p>
                            </div>
                        ) : (
                            // ✅ Using msg.id instead of array index as key
                            chat.map((msg) => (
                                <MessageBubble key={msg.id} msg={msg} />
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Typing indicator */}
                    <div className="h-6 px-4">
                        {typingUser && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <span>{typingUser} is typing</span>
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce [animation-delay:0.1s]">.</span>
                                <span className="animate-bounce [animation-delay:0.2s]">.</span>
                            </div>
                        )}
                    </div>

                    {/* Input bar */}
                    <div className="p-3 flex gap-2 bg-white border-t">
                        <input
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                handleTyping();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSend();
                            }}
                            className="border p-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Type a message..."
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 rounded-lg font-medium transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>

                {/* Online users sidebar */}
                <OnlineUsers users={onlineUsers} />
            </div>
        </div>
    );
}
