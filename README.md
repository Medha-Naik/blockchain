# 🚀 RoomLink / JustPost

**Privacy-First File Sharing Platform with Optional Blockchain Integration**

[![IP Privacy](https://img.shields.io/badge/IP-Hidden-success?style=for-the-badge)](.)
[![No Storage](https://img.shields.io/badge/Storage-Zero-blue?style=for-the-badge)](.)
[![Blockchain](https://img.shields.io/badge/Blockchain-Optional-purple?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](.)

---

## 📖 Overview

RoomLink (branded as JustPost) is a lightweight, privacy-first file sharing platform that enables instant, anonymous file transfers without storing any data. Built with Socket.IO relay architecture and optional blockchain integration for enhanced decentralization.

### ✨ Key Features

- 🔒 **Complete IP Privacy** - Your IP address is hidden from other users
- 🚫 **Zero Storage** - Files never touch the server or database
- ⚡ **Instant Transfer** - Real-time streaming via Socket.IO relay
- 🔐 **No Login Required** - Completely anonymous
- 🔗 **Blockchain Ready** - Optional decentralized features
- 📱 **Cross-Platform** - Works on mobile and desktop

---

## 🎯 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation & Running

**1. Clone Repository:**
```bash
git clone <YOUR_GIT_URL>
cd roomlink-share-direct
```

**2. Start Backend:**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

**3. Start Frontend:**
```bash
cd roomlink-share-direct
npm install
npm run dev
# Runs on http://localhost:8080
```

**4. Open Browser:**
```
http://localhost:8080
```

**5. Test Transfer:**
- Tab 1: Click "Send Files" → Get room code
- Tab 2: Click "Receive Files" → Enter code
- Files transfer automatically! ✅

---

## 📚 Documentation

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - 60-second testing guide
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Complete project status

### Architecture & Design
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[BACKEND_STRUCTURE.md](BACKEND_STRUCTURE.md)** - Backend details
- **[BLOCKCHAIN_ARCHITECTURE.md](BLOCKCHAIN_ARCHITECTURE.md)** - Blockchain design
- **[TECH_STACK.md](TECH_STACK.md)** - Technology stack

### Implementation Details
- **[IP_PRIVACY_IMPLEMENTATION.md](IP_PRIVACY_IMPLEMENTATION.md)** - Privacy details
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What's implemented
- **[JUSTPOST_SOLUTION.md](JUSTPOST_SOLUTION.md)** - Complete solution

### Setup & Deployment
- **[BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)** - Blockchain setup guide

---

## 🏗️ How It Works

### Standard Mode (No Blockchain)

```
┌─────────────┐                                    ┌─────────────┐
│   Sender    │                                    │  Receiver   │
│             │                                    │             │
│ IP: ???.??  │                                    │ IP: ???.??  │
│  (Hidden)   │                                    │  (Hidden)   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  Socket.io (WSS)                                │
       │  Encrypted Connection                           │
       │                                                  │
       └──────────────────┬──────────────────────────────┘
                          │
                          ▼
                ┌─────────────────┐
                │  Backend Server │
                │   (Relay Only)  │
                │                 │
                │  • Forwards data│
                │  • Hides IPs    │
                │  • No storage   │
                └─────────────────┘

✅ Neither peer knows the other's IP address
✅ Server acts as privacy shield
✅ No WebRTC = No IP exposure
```

### Blockchain Mode (Optional)

```
┌─────────────┐                                    ┌─────────────┐
│   Sender    │                                    │  Receiver   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │                                                  │
       └──────────────────┬──────────────────────────────┘
                          │
                          ▼
                ┌─────────────────┐
                │  Smart Contract │
                │   (Blockchain)  │
                │                 │
                │  • Room registry│
                │  • Relay nodes  │
                │  • Verification │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Relay Network  │
                │  (Decentralized)│
                │                 │
                │  Relay 1 → 2 → 3│
                │  (Multi-hop)    │
                └─────────────────┘

✅ Decentralized relay network
✅ On-chain room management
✅ Multi-hop routing for anonymity
```

---

## 🔒 Privacy & Security

### What's Protected

| Feature | Status | Description |
|---------|--------|-------------|
| IP Addresses | ✅ Hidden | Neither peer sees the other's IP |
| File Content | ✅ Private | Never stored on server |
| User Identity | ✅ Anonymous | No login or tracking |
| Transfer Data | ✅ Encrypted | WSS/TLS in production |
| Room Codes | ✅ Temporary | Auto-expire after 10 minutes |

### How Privacy Works

**Traditional WebRTC (Exposes IPs):**
```
Sender (IP: 192.168.1.100) ←→ Receiver (IP: 192.168.1.200)
         ↓                              ↓
    IP EXPOSED                     IP EXPOSED
```

**RoomLink Relay (Hides IPs):**
```
Sender → Backend Server (Relay) → Receiver
         ↓                         ↓
    Only knows server IP      Only knows server IP
    
✅ Complete IP Privacy
```

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

---

## 📊 Project Structure

```
roomlink-share-direct/
├── backend/                    # Backend server
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── sockets/           # Socket.io handlers
│   │   ├── middleware/        # Express middleware
│   │   └── utils/             # Utilities
│   └── package.json
│
├── roomlink-share-direct/     # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── config/            # Configuration
│   │   └── utils/             # Utilities
│   └── package.json
│
├── contracts/                  # Smart contracts
│   ├── scripts/               # Deployment scripts
│   ├── RoomLink.sol           # Main contract
│   └── hardhat.config.js      # Hardhat config
│
├── relay-node/                 # Relay node server
│   ├── server.js              # Relay implementation
│   └── package.json
│
└── Documentation/              # All documentation
    ├── ARCHITECTURE.md
    ├── BLOCKCHAIN_SETUP.md
    ├── PROJECT_STATUS.md
    └── ... (more docs)
```

---

## 🎯 Use Cases

### Personal
- 📸 Share photos with friends
- 💻 Transfer files between devices
- 📄 Send documents quickly
- 🔒 Privacy-conscious sharing

### Professional
- 👔 Client file delivery
- 🤝 Team collaboration
- 📊 Secure document sharing
- 📧 No email attachment limits

### Enterprise (with Blockchain)
- ✅ Compliance requirements
- 📝 Audit trail needed
- 🌐 Decentralized infrastructure
- 🔍 Verifiable transfers

---

## 🚀 Features

### Current Features (v1.0)

✅ **Core Functionality:**
- Room-based file sharing (4-digit codes)
- Real-time file transfer (64KB chunks)
- Multiple file support (up to 500MB)
- Drag & drop interface
- QR code generation
- Progress tracking
- Auto-download on receiver

✅ **Privacy & Security:**
- Complete IP address hiding
- No file storage on server
- No user authentication required
- Temporary rooms (10-minute expiration)
- Encrypted transport (WSS/TLS)

✅ **Blockchain Integration (Optional):**
- Smart contract deployment
- On-chain room registry
- Relay node management
- MetaMask integration
- Web3 wallet connection

### Planned Features (Roadmap)

📅 **Phase 2:**
- End-to-end file encryption
- Password-protected rooms
- Transfer history
- Resume interrupted transfers
- Support for 3+ users per room

📅 **Phase 3:**
- Distributed relay network
- Token economics ($JPOST)
- Zero-knowledge proofs
- Mobile apps
- Desktop apps

📅 **Phase 4:**
- Video/audio streaming
- Screen sharing
- In-room chat
- API for developers
- Enterprise features

---

## 🧪 Testing

### Quick Test (60 seconds)

1. **Start servers** (backend + frontend)
2. **Open two browser tabs**
3. **Tab 1:** Create room → Get code
4. **Tab 2:** Join room → Enter code
5. **Transfer file** → Auto-download ✅

### Detailed Testing

See **[QUICK_START.md](QUICK_START.md)** for comprehensive testing guide.

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
MAX_FILE_SIZE=524288000
BLOCKCHAIN_ENABLED=false
```

**Frontend (.env):**
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_BLOCKCHAIN_ENABLED=false
VITE_RELAY_ENABLED=true
```

### Feature Flags

**Standard Mode (No Blockchain):**
```env
VITE_BLOCKCHAIN_ENABLED=false
VITE_RELAY_ENABLED=true
```

**Blockchain Mode:**
```env
VITE_BLOCKCHAIN_ENABLED=true
VITE_RELAY_ENABLED=true
VITE_CONTRACT_ADDRESS=0x...
```

---

## 📈 Performance

### Transfer Speed
- **Small files (< 1MB):** Instant
- **Medium files (1-10MB):** 1-5 seconds
- **Large files (10-100MB):** 10-60 seconds
- **Max files (100-500MB):** 1-5 minutes

### Overhead
- **Relay overhead:** ~30% slower than direct P2P
- **Chunking overhead:** Minimal (64KB chunks)
- **Socket.io overhead:** ~5-10ms latency

### Scalability
- **Concurrent transfers:** Limited by server bandwidth
- **Max file size:** 500MB (configurable)
- **Room expiration:** 10 minutes
- **Max peers per room:** 2 (configurable)

---

## 🐛 Troubleshooting

### Common Issues

**Connection Badge Not Green:**
```bash
# Restart backend
cd backend
npm start
```

**"Room does not exist" Error:**
- Create room FIRST (sender)
- Then join room (receiver)
- Check room code is correct

**Files Not Downloading:**
- Allow pop-ups for localhost
- Check browser download settings
- Try smaller file (< 10MB)

See **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for more solutions.

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

## 📞 Contact & Support

### Documentation
- Read the docs in the root directory
- Check **[PROJECT_STATUS.md](PROJECT_STATUS.md)** for complete status
- See **[QUICK_START.md](QUICK_START.md)** for testing

### Issues
- Open GitHub issue
- Check browser console for errors
- Review backend logs

### Questions
- Read architecture documentation
- Check API documentation
- Review code comments

---

## 🎉 Summary

**What You Get:**
- ✅ Complete IP privacy
- ✅ Zero data storage
- ✅ Instant file transfers
- ✅ Optional blockchain integration
- ✅ Production-ready code
- ✅ Comprehensive documentation

**What Makes It Special:**
- First P2P file sharing with blockchain-based IP privacy
- Novel use of relay network for anonymity
- Practical solution to real privacy problem
- Production-ready architecture
- Clear path to monetization

**Ready For:**
- ✅ Hackathon presentation
- ✅ Production deployment
- ✅ Further development
- ✅ Community contributions

---

<div align="center">

**Built with ❤️ for privacy-conscious file sharing**

⭐ Star this repo if you find it useful!

[Documentation](PROJECT_STATUS.md) • [Quick Start](QUICK_START.md) • [Blockchain Guide](BLOCKCHAIN_SETUP.md)

</div>
