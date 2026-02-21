# 🚀 JustPost - Privacy-First File Sharing

**Lightweight, room-based real-time file sharing with optional blockchain integration**

[![IP Privacy](https://img.shields.io/badge/IP-Hidden-success?style=for-the-badge)](.)
[![No Storage](https://img.shields.io/badge/Storage-Zero-blue?style=for-the-badge)](.)
[![Blockchain](https://img.shields.io/badge/Blockchain-Optional-purple?style=for-the-badge)](.)

---

## 🎯 What is JustPost?

JustPost is a **privacy-first file sharing platform** that enables instant, anonymous file transfers without storing any data. Built with Socket.IO relay architecture and optional blockchain integration for enhanced decentralization.

### ✨ Unique Features

- 🔒 **No Login** - No registration or personal information required
- 🚫 **No Storage** - Files never touch the server or database
- 🌐 **No Cloud** - No dependency on cloud storage providers
- ⚡ **Instant Transfer** - Real-time streaming via Socket.IO relay
- 🏗️ **Lightweight** - Minimal server resources, maximum efficiency
- 🔐 **IP Privacy** - Your IP address is hidden from other users
- 🔗 **Blockchain Ready** - Optional decentralized features

---

## 🏗️ How It Works

```
1. User creates or joins a room
   └─> Unique 4-digit Room ID generated
   
2. Room ID connects two users
   └─> Both connect via encrypted Socket.IO
   
3. File sent via real-time socket connection
   └─> Chunked transfer (64KB chunks)
   
4. Server relays data instantly to the other user
   └─> No peer-to-peer (IP addresses hidden)
   
5. No database storage involved
   └─> Files never touch disk
   └─> In-memory relay only
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd justpost

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../roomlink-share-direct
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd roomlink-share-direct
npm run dev
# App runs on http://localhost:8080
```

### Usage

1. **Open:** http://localhost:8080/
2. **Send Files:**
   - Click "Send Files"
   - Get 4-digit room code
   - Select files to share
3. **Receive Files:**
   - Click "Receive Files"
   - Enter room code
   - Files download automatically

---

## 🔒 Privacy & Security

### What's Protected

✅ **IP Addresses** - Hidden from other users via relay  
✅ **No Login** - No personal information collected  
✅ **No Storage** - Files never stored on server  
✅ **Encrypted Transport** - WSS/TLS in production  
✅ **Temporary Rooms** - Auto-expire after transfer  
✅ **Anonymous** - No user tracking or analytics  

### How Privacy Works

```
Sender → Backend Server (Relay) → Receiver
         ↓                         ↓
    Only knows server IP      Only knows server IP
    
Neither peer knows the other's IP address ✅
```

---

## 🔗 Blockchain Integration (Optional)

JustPost supports optional blockchain features for enhanced decentralization:

### Features
- 🔗 Decentralized room discovery
- 📝 Immutable transfer logs
- 🪙 Token-based incentives ($JPOST)
- 🌐 Distributed relay network
- 🛡️ Censorship resistant

### Quick Enable

```bash
# 1. Deploy smart contract
cd contracts
npm install
npx hardhat run scripts/deploy.js --network sepolia

# 2. Update frontend config
# Edit roomlink-share-direct/.env
VITE_BLOCKCHAIN_ENABLED=true
VITE_CONTRACT_ADDRESS=0xYourContractAddress

# 3. Connect MetaMask and transfer!
```

See [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md) for detailed instructions.

---

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Socket.io Client
- React Router

### Backend
- Node.js + Express
- Socket.io Server (relay)
- In-memory storage
- CORS enabled

### Blockchain (Optional)
- Solidity smart contracts
- Hardhat development
- ethers.js integration
- MetaMask support

See [TECH_STACK.md](TECH_STACK.md) for complete details.

---

## 📊 Comparison

| Feature | JustPost | WeTransfer | Google Drive | AirDrop |
|---------|----------|------------|--------------|---------|
| No Login | ✅ | ❌ | ❌ | ✅ |
| No Storage | ✅ | ❌ | ❌ | ✅ |
| IP Privacy | ✅ | ❌ | ❌ | ⚠️ |
| Instant Transfer | ✅ | ❌ | ❌ | ✅ |
| Cross-Platform | ✅ | ✅ | ✅ | ❌ |
| Blockchain | ✅ | ❌ | ❌ | ❌ |
| Free | ✅ | ⚠️ | ⚠️ | ✅ |

---

## 📚 Documentation

- [JUSTPOST_SOLUTION.md](JUSTPOST_SOLUTION.md) - Complete solution overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [TECH_STACK.md](TECH_STACK.md) - Technology details
- [BLOCKCHAIN_ARCHITECTURE.md](BLOCKCHAIN_ARCHITECTURE.md) - Blockchain design
- [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md) - Blockchain setup guide
- [IP_PRIVACY_IMPLEMENTATION.md](IP_PRIVACY_IMPLEMENTATION.md) - Privacy details
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

---

## 🎯 Use Cases

### Personal
- Share photos with friends
- Transfer files between devices
- Send documents quickly
- Privacy-conscious sharing

### Professional
- Client file delivery
- Team collaboration
- Secure document sharing
- No email attachment limits

### Enterprise (with Blockchain)
- Compliance requirements
- Audit trail needed
- Decentralized infrastructure
- Verifiable transfers

---

## 🗺️ Roadmap

### ✅ Phase 1: Core Platform (Complete)
- Socket.IO relay architecture
- IP privacy protection
- Real-time file transfer
- Room-based system
- Web interface

### 🔄 Phase 2: Blockchain Integration (In Progress)
- Smart contract development
- MetaMask integration
- Room registration on-chain
- Token economics
- Relay node registry

### 📅 Phase 3: Decentralization (Planned)
- Distributed relay network
- Token launch ($JPOST)
- Governance system
- Community treasury
- Multi-chain support

### 🔮 Phase 4: Advanced Features (Future)
- End-to-end file encryption
- Zero-knowledge proofs
- Mobile apps
- Desktop apps
- API for developers

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Socket.io for real-time communication
- shadcn/ui for beautiful components
- Hardhat for blockchain development
- The open-source community

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">

**Built with ❤️ for privacy-conscious file sharing**

⭐ Star this repo if you find it useful!

[Website](#) • [Documentation](JUSTPOST_SOLUTION.md) • [Blockchain Guide](BLOCKCHAIN_SETUP.md)

</div>

<div align="center">

![RoomLink](https://img.shields.io/badge/RoomLink-P2P%20File%20Sharing-blue?style=for-the-badge)
![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Transfer files peer-to-peer. Securely. No storage. No limits.**

[Live Demo](#) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started)

</div>

---

## 📖 About

RoomLink is a privacy-first, peer-to-peer file sharing application that enables secure file transfers directly between devices without storing data on any server. Built with WebRTC technology, it ensures end-to-end encryption and zero data retention.

### 🎯 Problem Statement

- Cloud services compromise privacy by storing user data
- Email has restrictive attachment size limits (typically 25MB)
- USB drives require physical proximity
- Traditional file sharing exposes data to third-party servers
- Complex setup for secure peer-to-peer transfers

### 💡 Our Solution

RoomLink provides a simple, secure, and fast way to share files directly between devices using WebRTC technology, ensuring your files never touch our servers.

---

## ✨ Features

### 🔒 Security & Privacy
- **End-to-End Encryption** - WebRTC DTLS encryption
- **Zero Server Storage** - Files transfer directly peer-to-peer
- **No Sign-Up Required** - Completely anonymous
- **Temporary Rooms** - Auto-expire when empty

### 🎨 User Experience
- **Simple Room Codes** - Easy 4-digit pairing system
- **QR Code Sharing** - Instant mobile device pairing
- **Drag & Drop** - Intuitive file upload
- **Real-Time Progress** - Live transfer tracking
- **Multiple Files** - Send up to 500MB at once
- **Responsive Design** - Works on mobile and desktop

### ⚡ Technical
- **Cross-Network Transfers** - Works over the internet
- **Chunked Streaming** - 64KB chunks with backpressure handling
- **Auto-Download** - Files download automatically on receiver
- **File Type Detection** - Smart icons for different file types

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **WebRTC API** - Peer-to-peer data transfer
- **QRCode.react** - QR code generation

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **Socket.io** - WebSocket server for signaling
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Architecture
- **WebRTC** - Direct peer-to-peer file transfer
- **Socket.io** - Connection signaling and room management
- **STUN Servers** - NAT traversal (Google STUN)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd roomlink-share-direct
```

2. **Install Frontend Dependencies**
```bash
cd roomlink-share-direct
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm start
```
Backend runs on `http://localhost:3000`

2. **Start the Frontend Development Server**
```bash
cd roomlink-share-direct
npm run dev
```
Frontend runs on `http://localhost:5173`

3. **Open in Browser**
Navigate to `http://localhost:5173`

---

## 📱 How It Works

### 3-Step Process

1. **Sender Creates Room**
   - Click "Send Files"
   - Get a unique 4-digit room code
   - Select files to share
   - Share code or QR with receiver

2. **Receiver Joins Room**
   - Enter the 4-digit room code or scan QR
   - WebRTC connection establishes automatically
   - Wait for sender to initiate transfer

3. **Direct Transfer**
   - Files transfer peer-to-peer (encrypted)
   - Real-time progress tracking
   - Auto-download on completion
   - Room expires after transfer

### Technical Flow

```
Sender                    Backend (Signaling)              Receiver
  |                              |                              |
  |------ Create Room ---------->|                              |
  |<----- Room Code -------------|                              |
  |                              |<------ Join Room ------------|
  |<---- User Joined ------------|------- User Joined --------->|
  |------ WebRTC Offer --------->|------- WebRTC Offer -------->|
  |<----- WebRTC Answer ---------|<------ WebRTC Answer --------|
  |<========== P2P Connection Established =====================>|
  |<========== File Transfer (Direct, Encrypted) ==============>|
```

---

## 📂 Project Structure

```
roomlink-share-direct/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── socket.js          # Socket.io configuration
│   │   ├── controllers/
│   │   │   └── roomController.js  # Room creation logic
│   │   ├── routes/
│   │   │   └── roomRoutes.js      # API routes
│   │   ├── sockets/
│   │   │   └── roomSocket.js      # WebRTC signaling
│   │   ├── utils/
│   │   │   └── roomStore.js       # In-memory room storage
│   │   ├── app.js                 # Express app
│   │   └── server.js              # Server entry point
│   └── package.json
│
├── roomlink-share-direct/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/                # shadcn/ui components
│   │   ├── hooks/
│   │   │   └── useWebRTC.ts       # WebRTC logic
│   │   ├── pages/
│   │   │   ├── Index.tsx          # Landing page
│   │   │   ├── SendRoom.tsx       # Sender interface
│   │   │   ├── ReceiveRoom.tsx    # Receiver interface
│   │   │   └── NotFound.tsx       # 404 page
│   │   ├── lib/
│   │   │   └── utils.ts           # Utility functions
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── socket.js              # Socket.io client
│   └── package.json
```

---

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env`)
```env
VITE_API_URL=http://localhost:3000
```

**Backend** (`.env`)
```env
PORT=3000
```

---

## 📊 Current Limitations

- Max 2 users per room
- 500MB total file size limit
- No persistent database (in-memory storage)
- No user authentication
- Rooms expire when empty
- No transfer history
- No resume capability for interrupted transfers

---

## 🚀 Future Roadmap

### Phase 1 - MVP Enhancement
- [ ] 10-minute room expiration timer
- [ ] Transfer history with Supabase integration
- [ ] Resume interrupted transfers
- [ ] Password-protected rooms
- [ ] Support for 3+ users per room

### Phase 2 - Growth Features
- [ ] User accounts & authentication
- [ ] Persistent room links
- [ ] File preview before download
- [ ] Mobile app (React Native)
- [ ] Transfer analytics dashboard

### Phase 3 - Enterprise Scale
- [ ] TURN server for restricted networks
- [ ] Video/audio streaming capability
- [ ] Screen sharing
- [ ] In-room chat functionality
- [ ] Enterprise admin panel
- [ ] API for developers

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- WebRTC technology for enabling peer-to-peer connections
- Socket.io for real-time communication
- shadcn/ui for beautiful UI components
- Google STUN servers for NAT traversal

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">

**Built with ❤️ for privacy-conscious file sharing**

⭐ Star this repo if you find it useful!

</div>
