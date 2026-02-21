import { ENV } from '../config/env.js';

/**
 * Room Service - Manage relay rooms
 */

// In-memory storage
const rooms = new Map();
const relayRooms = new Map();

export class RoomService {
  /**
   * Create a new room
   */
  static createRoom(roomId) {
    rooms.set(roomId, {
      id: roomId,
      createdAt: Date.now(),
      expiresAt: Date.now() + ENV.ROOM_EXPIRATION,
      peers: [],
      active: true
    });

    console.log(`✅ Room created: ${roomId}`);
    return rooms.get(roomId);
  }

  /**
   * Create a relay room
   */
  static createRelayRoom(roomId) {
    relayRooms.set(roomId, {
      id: roomId,
      sender: null,
      receiver: null,
      createdAt: Date.now(),
      expiresAt: Date.now() + ENV.ROOM_EXPIRATION,
      active: true,
      fileMetadata: null
    });

    console.log(`✅ Relay room created: ${roomId}`);
    return relayRooms.get(roomId);
  }

  /**
   * Get room by ID
   */
  static getRoom(roomId) {
    return rooms.get(roomId);
  }

  /**
   * Get relay room by ID
   */
  static getRelayRoom(roomId) {
    return relayRooms.get(roomId);
  }

  /**
   * Check if room exists
   */
  static roomExists(roomId) {
    return rooms.has(roomId);
  }

  /**
   * Check if relay room exists
   */
  static relayRoomExists(roomId) {
    return relayRooms.has(roomId);
  }

  /**
   * Join room
   */
  static joinRoom(roomId, socketId) {
    const room = rooms.get(roomId);
    if (!room) return false;

    if (room.peers.length >= ENV.MAX_PEERS_PER_ROOM) {
      return false;
    }

    room.peers.push(socketId);
    console.log(`✅ Peer ${socketId} joined room ${roomId}`);
    return true;
  }

  /**
   * Join relay room
   */
  static joinRelayRoom(roomId, socketId, role) {
    let room = relayRooms.get(roomId);
    
    if (!room) {
      room = this.createRelayRoom(roomId);
    }

    if (role === 'sender') {
      if (room.sender) return false;
      room.sender = socketId;
    } else if (role === 'receiver') {
      if (room.receiver) return false;
      room.receiver = socketId;
    }

    console.log(`✅ ${role} ${socketId} joined relay room ${roomId}`);
    return true;
  }

  /**
   * Leave room
   */
  static leaveRoom(roomId, socketId) {
    const room = rooms.get(roomId);
    if (!room) return;

    room.peers = room.peers.filter(id => id !== socketId);
    
    if (room.peers.length === 0) {
      rooms.delete(roomId);
      console.log(`🗑️ Room ${roomId} deleted (empty)`);
    }
  }

  /**
   * Leave relay room
   */
  static leaveRelayRoom(roomId, socketId) {
    const room = relayRooms.get(roomId);
    if (!room) return;

    if (room.sender === socketId) {
      room.sender = null;
    }
    if (room.receiver === socketId) {
      room.receiver = null;
    }

    if (!room.sender && !room.receiver) {
      relayRooms.delete(roomId);
      console.log(`🗑️ Relay room ${roomId} deleted (empty)`);
    }
  }

  /**
   * Set file metadata for room
   */
  static setFileMetadata(roomId, metadata) {
    const room = relayRooms.get(roomId);
    if (room) {
      room.fileMetadata = metadata;
    }
  }

  /**
   * Get file metadata for room
   */
  static getFileMetadata(roomId) {
    const room = relayRooms.get(roomId);
    return room ? room.fileMetadata : null;
  }

  /**
   * Clean up expired rooms
   */
  static cleanupExpiredRooms() {
    const now = Date.now();
    
    // Clean up regular rooms
    for (const [roomId, room] of rooms.entries()) {
      if (now > room.expiresAt) {
        rooms.delete(roomId);
        console.log(`🗑️ Expired room deleted: ${roomId}`);
      }
    }

    // Clean up relay rooms
    for (const [roomId, room] of relayRooms.entries()) {
      if (now > room.expiresAt) {
        relayRooms.delete(roomId);
        console.log(`🗑️ Expired relay room deleted: ${roomId}`);
      }
    }
  }

  /**
   * Get room statistics
   */
  static getStats() {
    return {
      totalRooms: rooms.size,
      totalRelayRooms: relayRooms.size,
      activeRooms: Array.from(rooms.values()).filter(r => r.active).length,
      activeRelayRooms: Array.from(relayRooms.values()).filter(r => r.active).length
    };
  }
}

// Cleanup expired rooms every minute
setInterval(() => {
  RoomService.cleanupExpiredRooms();
}, 60000);

export default RoomService;
