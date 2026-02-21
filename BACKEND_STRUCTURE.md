# 🏗️ Backend Structure Documentation

## 📁 Directory Structure

```
backend/
├── src/
│   ├── server.js                    # Server entry point
│   ├── app.js                       # Express app configuration
│   │
│   ├── config/
│   │   ├── blockchain.js            # Blockchain initialization
│   │   ├── socket.js                # Socket.IO configuration
│   │   └── env.js                   # Environment variables
│   │
│   ├── controllers/
│   │   ├── roomController.js        # Room creation logic
│   │   └── verificationController.js # File verification
│   │
│   ├── services/
│   │   ├── blockchainService.js     # Blockchain interactions
│   │   ├── hashService.js           # Cryptographic hashing
│   │   └── roomService.js           # Room management
│   │
│   ├── routes/
│   │   ├── roomRoutes.js            # Room API routes
│   │   └── verificationRoutes.js    # Verification routes
│   │
│   ├── sockets/
│   │   ├── roomSocket.js            # Legacy WebRTC signaling
│   │   └── relaySocket.js           # IP-private relay
│   │
│   ├── utils/
│   │   ├── generateRoomId.js        # Room ID generation
│   │   └── logger.js                # Logging utility
│   │
│   └── middleware/
│       └── errorHandler.js          # Error handling
│
├── package.json
├── .env.example
└── .env
```

---

## 🔧 Component Details

### 1. Configuration Layer

#### `config/env.js`
**Purpose:** Centralized environment configuration

**Exports:**
```javascript
ENV = {
  PORT,
  NODE_ENV,
  CORS_ORIGIN,
  MAX_FILE_SIZE,
  CHUNK_SIZE,
  MAX_BUFFER_SIZE,
  ROOM_EXPIRATION,
  MAX_PEERS_PER_ROOM,
  BLOCKCHAIN_ENABLED,
  BLOCKCHAIN_NETWORK,
  CONTRACT_ADDRESS,
  RPC_URL,
  PRIVATE_KEY
}
```

#### `config/blockchain.js`
**Purpose:** Initialize blockchain connection

**Functions:**
- `initBlockchain()` - Initialize provider and contract
- `getProvider()` - Get ethers provider
- `getContract()` - Get contract instance

**Features:**
- Connects to Ethereum/Polygon networks
- Initializes smart contract
- Handles connection errors gracefully

#### `config/socket.js`
**Purpose:** Configure Socket.IO server

**Features:**
- CORS configuration
- Buffer size limits
- Relay and signaling handlers
- Connection management

---

### 2. Service Layer

#### `services/hashService.js`
**Purpose:** Cryptographic hashing utilities

**Methods:**
```javascript
HashService.generateHash(data)           // SHA-256 hash
HashService.hashFile(buffer)             // Hash file buffer
HashService.hashMetadata(name, size, type) // Hash metadata
HashService.hashRoom(roomId)             // Hash room ID
HashService.verifyHash(data, hash)       // Verify hash
HashService.toBytes32(data)              // Ethereum bytes32
```

**Use Cases:**
- File integrity verification
- Blockchain data preparation
- Transfer verification

#### `services/blockchainService.js`
**Purpose:** Blockchain interaction layer

**Methods:**
```javascript
BlockchainService.verifyTransfer(roomId, fileHash, fileSize)
BlockchainService.getTransferVerification(roomId)
BlockchainService.listenForVerifications(callback)
BlockchainService.isAvailable()
BlockchainService.getNetworkInfo()
```

**Features:**
- Smart contract interactions
- Event listening
- Network status checking
- Error handling

#### `services/roomService.js`
**Purpose:** Room management

**Methods:**
```javascript
RoomService.createRoom(roomId)
RoomService.createRelayRoom(roomId)
RoomService.getRoom(roomId)
RoomService.getRelayRoom(roomId)
RoomService.roomExists(roomId)
RoomService.joinRoom(roomId, socketId)
RoomService.joinRelayRoom(roomId, socketId, role)
RoomService.leaveRoom(roomId, socketId)
RoomService.setFileMetadata(roomId, metadata)
RoomService.getFileMetadata(roomId)
RoomService.cleanupExpiredRooms()
RoomService.getStats()
```

**Features:**
- In-memory room storage
- Automatic expiration
- Metadata management
- Statistics tracking

---

### 3. Controller Layer

#### `controllers/roomController.js`
**Purpose:** Handle room creation requests

**Endpoints:**
- `POST /api/create-room` - Create new room

**Response:**
```json
{
  "roomId": "1234"
}
```

#### `controllers/verificationController.js`
**Purpose:** Handle file verification

**Endpoints:**
- `POST /api/verify` - Verify file transfer
- `GET /api/verify/:roomId` - Get verification status
- `GET /api/verify/network` - Get blockchain network info

**Verification Flow:**
```
1. Receive file metadata
2. Generate hash
3. Store in room service
4. Verify on blockchain (if enabled)
5. Return verification result
```

---

### 4. Routes Layer

#### `routes/roomRoutes.js`
**Routes:**
```javascript
POST /api/create-room  → roomController.createRoomHandler
```

#### `routes/verificationRoutes.js`
**Routes:**
```javascript
POST /api/verify              → verificationController.verifyTransfer
GET  /api/verify/:roomId      → verificationController.getVerification
GET  /api/verify/network      → verificationController.getNetworkInfo
```

---

### 5. Socket Layer

#### `sockets/relaySocket.js`
**Purpose:** Handle IP-private relay transfers

**Events:**
```javascript
// Client → Server
join-relay-room        // Join as sender/receiver
relay-file-list        // Send file list
relay-file-start       // Start file transfer
relay-file-chunk       // Send file chunk
relay-file-end         // End file transfer
relay-transfer-complete // Transfer complete

// Server → Client
relay-connected        // Peer connected
relay-file-list        // Receive file list
relay-file-start       // File transfer starting
relay-file-chunk       // Receive file chunk
relay-file-end         // File transfer complete
relay-transfer-complete // All files transferred
relay-error            // Error occurred
```

**Privacy:**
- ✅ No IP addresses exposed
- ✅ Server acts as relay
- ✅ Encrypted transport

---

### 6. Utilities

#### `utils/generateRoomId.js`
**Functions:**
```javascript
generateRoomId()        // Random 4-digit ID
generateSecureRoomId()  // Cryptographically secure ID
```

#### `utils/logger.js`
**Methods:**
```javascript
logger.error(message, data)
logger.warn(message, data)
logger.info(message, data)
logger.debug(message, data)

// Specific loggers
logger.roomCreated(roomId)
logger.roomJoined(roomId, socketId, role)
logger.fileTransferStart(roomId, fileName, fileSize)
logger.blockchainVerification(roomId, fileHash)
```

---

### 7. Middleware

#### `middleware/errorHandler.js`
**Functions:**
```javascript
errorHandler(err, req, res, next)  // Global error handler
notFoundHandler(req, res)          // 404 handler
```

**Features:**
- Centralized error handling
- Development vs production modes
- Error logging
- Safe error responses

---

## 🔄 Data Flow

### File Transfer with Verification

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /api/create-room
       ▼
┌─────────────────┐
│ roomController  │
└──────┬──────────┘
       │
       │ 2. Generate room ID
       ▼
┌─────────────────┐
│  roomService    │
└──────┬──────────┘
       │
       │ 3. Store room
       ▼
┌─────────────────┐
│   In-Memory     │
└─────────────────┘

       │
       │ 4. Connect via Socket.IO
       ▼
┌─────────────────┐
│  relaySocket    │
└──────┬──────────┘
       │
       │ 5. Transfer files (relay)
       ▼
┌─────────────────┐
│   Receiver      │
└──────┬──────────┘
       │
       │ 6. POST /api/verify
       ▼
┌──────────────────────┐
│ verificationController│
└──────┬───────────────┘
       │
       │ 7. Generate hash
       ▼
┌─────────────────┐
│  hashService    │
└──────┬──────────┘
       │
       │ 8. Verify on blockchain
       ▼
┌─────────────────────┐
│ blockchainService   │
└──────┬──────────────┘
       │
       │ 9. Smart contract call
       ▼
┌─────────────────┐
│   Blockchain    │
└─────────────────┘
```

---

## 🔐 Security Features

### IP Privacy
```
✅ Relay-based architecture
✅ No WebRTC (no IP exposure)
✅ Server-mediated transfers
✅ Encrypted transport (WSS/TLS)
```

### Data Protection
```
✅ No file storage
✅ In-memory only
✅ Automatic cleanup
✅ Temporary rooms
```

### Blockchain Security
```
✅ Immutable verification
✅ Cryptographic hashing
✅ Smart contract auditing
✅ Transparent operations
```

---

## 📊 API Endpoints

### Room Management
```
POST /api/create-room
Response: { roomId: "1234" }
```

### Verification
```
POST /api/verify
Body: {
  roomId: "1234",
  fileName: "document.pdf",
  fileSize: 1048576,
  fileType: "application/pdf"
}
Response: {
  success: true,
  data: {
    roomId: "1234",
    fileHash: "0x...",
    blockchain: { ... }
  }
}

GET /api/verify/:roomId
Response: {
  success: true,
  data: {
    metadata: { ... },
    blockchain: { ... }
  }
}

GET /api/verify/network
Response: {
  success: true,
  data: {
    name: "sepolia",
    chainId: "11155111",
    blockNumber: 12345
  }
}
```

### Health Check
```
GET /
Response: {
  name: "JustPost API",
  version: "1.0.0",
  status: "running",
  features: {
    relay: true,
    blockchain: false,
    ipPrivacy: true
  }
}

GET /health
Response: {
  status: "healthy",
  timestamp: "2024-..."
}
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start Server
```bash
npm start
```

### 4. Enable Blockchain (Optional)
```bash
# In .env
BLOCKCHAIN_ENABLED=true
CONTRACT_ADDRESS=0xYourContractAddress
RPC_URL=https://rpc.sepolia.org
```

---

## 🧪 Testing

### Test Room Creation
```bash
curl -X POST http://localhost:5000/api/create-room
```

### Test Verification
```bash
curl -X POST http://localhost:5000/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "1234",
    "fileName": "test.pdf",
    "fileSize": 1024,
    "fileType": "application/pdf"
  }'
```

### Test Health
```bash
curl http://localhost:5000/health
```

---

## 📈 Monitoring

### Logs
```bash
# Server logs show:
[2024-...] [INFO] Room created: 1234
[2024-...] [INFO] Socket abc123 joined room 1234 as sender
[2024-...] [INFO] File transfer started in room 1234
[2024-...] [INFO] Blockchain verification for room 1234
```

### Statistics
```javascript
// Get room statistics
const stats = RoomService.getStats();
// Returns: { totalRooms, totalRelayRooms, activeRooms, activeRelayRooms }
```

---

## ✅ Summary

**Backend Structure:**
- ✅ Modular and organized
- ✅ Service-oriented architecture
- ✅ Blockchain integration ready
- ✅ IP privacy built-in
- ✅ Comprehensive logging
- ✅ Error handling
- ✅ Production ready

**Key Features:**
- Relay-based file transfer
- Optional blockchain verification
- Cryptographic hashing
- Room management
- Automatic cleanup
- Health monitoring

**Your backend is now fully structured and ready for production!** 🚀
