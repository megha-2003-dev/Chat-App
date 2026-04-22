import { socket } from "../socket";

// ✅ Separate component for a single message bubble
export default function MessageBubble({ msg }) {
    const isOwn = msg.sender === socket.id;
    const isSystem = msg.sender === "system";

    // System messages (join/leave) shown differently
    if (isSystem) {
        return (
            <div className="text-center my-2">
                <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
                    {msg.message}
                </span>
            </div>
        );
    }

    return (
        <div className={`mb-3 flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
            <p className="text-xs text-gray-500 mb-1">{msg.username}</p>
            <div
                className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                    isOwn
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
            >
                {msg.message}
            </div>
            <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
        </div>
    );
}
