import { io } from "socket.io-client";

// Use environment variable or fallback to local
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

console.log("Connecting to backend:", BACKEND_URL);

export const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
  withCredentials: true
});
