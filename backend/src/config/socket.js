import { Server } from "socket.io";
import { handleRoomSocket } from "../sockets/roomSocket.js";
import { handleRelaySocket } from "../sockets/relaySocket.js";
import { ENV } from "./env.js";

export const initSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: ENV.CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 10e6 // 10MB for file chunks
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Handle both WebRTC signaling and relay transfers
    handleRoomSocket(io, socket);
    handleRelaySocket(io, socket);
  });

  return io;
};
