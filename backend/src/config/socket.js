import { Server } from "socket.io";
import { handleRoomSocket } from "../sockets/roomSocket.js";
import { handleRelaySocket } from "../sockets/relaySocket.js";

export const initSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 10e6 // 10MB for file chunks
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Handle both WebRTC signaling and relay transfers
    handleRoomSocket(io, socket);
    handleRelaySocket(io, socket);
  });

};
