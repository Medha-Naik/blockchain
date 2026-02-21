import { io } from "socket.io-client";

// Use local backend server
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"]
});
