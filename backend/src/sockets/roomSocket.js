import {
  joinRoom,
  leaveRoom,
  roomExists
} from "../utils/roomStore.js";

export const handleRoomSocket = (io, socket) => {

  socket.on("join-room", ({ roomId }) => {
    console.log(`[${socket.id}] Attempting to join room: ${roomId}`);

    if (!roomExists(roomId)) {
      console.log(`[${socket.id}] Room ${roomId} does not exist`);
      socket.emit("error-message", "Room does not exist");
      return;
    }

    const joined = joinRoom(roomId, socket.id);

    if (!joined) {
      console.log(`[${socket.id}] Room ${roomId} is full`);
      socket.emit("error-message", "Room full");
      return;
    }

    socket.join(roomId);
    console.log(`[${socket.id}] Successfully joined room: ${roomId}`);
    socket.to(roomId).emit("user-joined");
    console.log(`[${socket.id}] Notified other users in room: ${roomId}`);

    // WebRTC Signaling
    socket.on("offer", (data) => {
      console.log(`[${socket.id}] Sending offer to room: ${roomId}`);
      socket.to(roomId).emit("offer", data);
    });

    socket.on("answer", (data) => {
      console.log(`[${socket.id}] Sending answer to room: ${roomId}`);
      socket.to(roomId).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
      console.log(`[${socket.id}] Sending ICE candidate to room: ${roomId}`);
      socket.to(roomId).emit("ice-candidate", data);
    });

    socket.on("disconnect", () => {
      console.log(`[${socket.id}] User disconnected from room: ${roomId}`);
      leaveRoom(roomId, socket.id);
      socket.to(roomId).emit("user-left");
    });

  });

};
