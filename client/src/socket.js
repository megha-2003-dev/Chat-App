import { io } from "socket.io-client";

// ✅ URL comes from .env — not hardcoded
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
    autoConnect: true,
});
