/**
 * Relay-based file transfer (No IP exposure)
 * Files are routed through the server, hiding peer IPs
 */

import { roomExists } from "../utils/roomStore.js";

const relayRooms = new Map(); // roomId -> { sender, receiver }

export const handleRelaySocket = (io, socket) => {
  console.log(`[Relay] New connection: ${socket.id}`);

  // Join relay room
  socket.on("join-relay-room", ({ roomId, role }) => {
    console.log(`[Relay] ${socket.id} joining room ${roomId} as ${role}`);

    // Validate room exists (must be created via API first)
    if (!roomExists(roomId)) {
      console.log(`[Relay] Room ${roomId} does not exist`);
      socket.emit("relay-error", { message: "Room does not exist" });
      return;
    }

    if (!relayRooms.has(roomId)) {
      relayRooms.set(roomId, { sender: null, receiver: null });
    }

    const room = relayRooms.get(roomId);

    if (role === "sender") {
      room.sender = socket.id;
      socket.join(roomId);
      socket.relayRoom = roomId;
      socket.relayRole = "sender";

      // Notify if receiver already connected
      if (room.receiver) {
        io.to(room.sender).emit("relay-connected");
        io.to(room.receiver).emit("relay-connected");
        console.log(`[Relay] Both peers connected in room ${roomId}`);
      }
    } else if (role === "receiver") {
      room.receiver = socket.id;
      socket.join(roomId);
      socket.relayRoom = roomId;
      socket.relayRole = "receiver";

      // Notify if sender already connected
      if (room.sender) {
        io.to(room.sender).emit("relay-connected");
        io.to(room.receiver).emit("relay-connected");
        console.log(`[Relay] Both peers connected in room ${roomId}`);
      }
    }
  });

  // Relay file list
  socket.on("relay-file-list", ({ roomId, files }) => {
    console.log(`[Relay] File list for room ${roomId}:`, files.length, "files");
    const room = relayRooms.get(roomId);
    if (room && room.receiver) {
      io.to(room.receiver).emit("relay-file-list", { files });
    }
  });

  // Relay file start
  socket.on("relay-file-start", ({ roomId, name, size, type }) => {
    
    const room = relayRooms.get(roomId);
    if (room && room.receiver) {
      io.to(room.receiver).emit("relay-file-start", { name, size, type });
    }
  });

  // Relay file chunk
  socket.on("relay-file-chunk", ({ roomId, name, chunk }) => {
    const room = relayRooms.get(roomId);
    if (room && room.receiver) {
      // Forward chunk to receiver (server acts as relay)
      io.to(room.receiver).emit("relay-file-chunk", { name, chunk });
    }
  });

  // Relay file end
  socket.on("relay-file-end", ({ roomId, name }) => {
   
    const room = relayRooms.get(roomId);
    if (room && room.receiver) {
      io.to(room.receiver).emit("relay-file-end", { name });
    }
  });

  // Relay transfer complete
  socket.on("relay-transfer-complete", ({ roomId }) => {
    console.log(`[Relay] Transfer complete for room ${roomId}`);
    const room = relayRooms.get(roomId);
    if (room) {
      if (room.sender) io.to(room.sender).emit("relay-transfer-complete");
      if (room.receiver) io.to(room.receiver).emit("relay-transfer-complete");
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`[Relay] Disconnected: ${socket.id}`);

    if (socket.relayRoom) {
      const room = relayRooms.get(socket.relayRoom);
      if (room) {
        // Notify other peer
        const otherPeer =
          socket.relayRole === "sender" ? room.receiver : room.sender;
        if (otherPeer) {
          io.to(otherPeer).emit("relay-error", {
            message: "Other peer disconnected",
          });
        }

        // Clean up room if both disconnected
        if (socket.relayRole === "sender") {
          room.sender = null;
        } else {
          room.receiver = null;
        }

        if (!room.sender && !room.receiver) {
          relayRooms.delete(socket.relayRoom);
          console.log(`[Relay] Room ${socket.relayRoom} cleaned up`);
        }
      }
    }
  });
};
