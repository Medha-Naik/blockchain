# 🛠️ Tech Stack - RoomLink (IP-Private Version)

## 📚 Complete Technology Stack

---

## 🎨 Frontend Stack

### Core Framework & Language
```
React 18.3.1              - UI library
TypeScript 5.8.3          - Type-safe JavaScript
Vite 5.4.19              - Build tool & dev server
```

### UI & Styling
```
Tailwind CSS 3.4.17      - Utility-first CSS framework
shadcn/ui                - Component library
Radix UI                 - Accessible UI primitives
  ├─ @radix-ui/react-accordion
  ├─ @radix-ui/react-alert-dialog
  ├─ @radix-ui/react-avatar
  ├─ @radix-ui/react-checkbox
  ├─ @radix-ui/react-dialog
  ├─ @radix-ui/react-dropdown-menu
  ├─ @radix-ui/react-label
  ├─ @radix-ui/react-popover
  ├─ @radix-ui/react-progress
  ├─ @radix-ui/react-scroll-area
  ├─ @radix-ui/react-select
  ├─ @radix-ui/react-separator
  ├─ @radix-ui/react-slider
  ├─ @radix-ui/react-switch
  ├─ @radix-ui/react-tabs
  ├─ @radix-ui/react-toast
  └─ @radix-ui/react-tooltip

Lucide React 0.462.0     - Icon library
class-variance-authority - CSS variant management
clsx 2.1.1               - Conditional classNames
tailwind-merge 2.6.0     - Merge Tailwind classes
tailwindcss-animate      - Animation utilities
```

### Routing & Navigation
```
React Router DOM 6.30.1  - Client-side routing
  ├─ BrowserRouter
  ├─ Routes
  ├─ Route
  ├─ useNavigate
  ├─ useParams
  └─ Link
```

### Real-Time Communication (IP-Private)
```
Socket.io Client 4.8.3   - WebSocket client
  ├─ Real-time relay communication
  ├─ File transfer via relay
  ├─ Room management
  └─ NO WebRTC (no IP exposure)
```

### State Management & Data Fetching
```
TanStack Query 5.83.0    - Server state management
  ├─ QueryClient
  ├─ QueryClientProvider
  └─ Data caching

React Hooks              - Built-in state management
  ├─ useState
  ├─ useEffect
  ├─ useCallback
  ├─ useRef
  └─ Custom hooks
```

### Form Handling & Validation
```
React Hook Form 7.61.1   - Form management
Zod 3.25.76             - Schema validation
@hookform/resolvers     - Form validation integration
```

### UI Enhancements
```
QRCode.react 3.2.0      - QR code generation
Sonner 1.7.4            - Toast notifications
date-fns 3.6.0          - Date utilities
input-otp 1.4.2         - OTP input component
```

### Development Tools
```
@vitejs/plugin-react-swc - Fast React refresh
ESLint 9.32.0           - Code linting
TypeScript ESLint       - TypeScript linting
Autoprefixer 10.4.21    - CSS vendor prefixes
PostCSS 8.5.6           - CSS processing
```

### Testing
```
Vitest 3.2.4            - Unit testing
@testing-library/react  - React testing utilities
@testing-library/jest-dom - Jest DOM matchers
jsdom 20.0.3            - DOM implementation
```

---

## 🔧 Backend Stack

### Runtime & Framework
```
Node.js                 - JavaScript runtime
Express 5.2.1          - Web framework
  ├─ Routing
  ├─ Middleware
  ├─ HTTP server
  └─ API endpoints
```

### Real-Time Communication (Relay Server)
```
Socket.io 4.8.3        - WebSocket server
  ├─ Relay room management
  ├─ File forwarding
  ├─ IP privacy protection
  ├─ Connection tracking
  └─ Event handling
```

### Utilities
```
CORS 2.8.6             - Cross-origin resource sharing
dotenv 17.3.1          - Environment variables
UUID 13.0.0            - Unique ID generation
```

### Server Architecture
```
HTTP Server            - Built-in Node.js http module
In-Memory Storage      - JavaScript objects/Maps
  ├─ Room storage
  ├─ Relay room management
  └─ Socket tracking
```

---

## 🏗️ Architecture & Protocols

### Communication Protocol
```
Socket.io (WebSocket)  - Real-time bidirectional communication
  ├─ WSS (WebSocket Secure) in production
  ├─ Automatic reconnection
  ├─ Event-based messaging
  └─ Binary data support

❌ NO WebRTC          - Removed to prevent IP exposure
❌ NO STUN Servers    - Not needed (no P2P)
❌ NO TURN Servers    - Not needed (relay-based)
```

### Data Transfer
```
Chunked Transfer       - 64KB chunks
Base64 Encoding        - For binary data over Socket.io
Streaming              - Progressive file transfer
Buffering              - 10MB max buffer size
```

### Security
```
WSS/TLS               - Encrypted WebSocket (production)
CORS                  - Cross-origin protection
Input Validation      - File size limits
Rate Limiting         - (Recommended for production)
```

---

## 🔒 Privacy & Security Stack

### IP Privacy
```
✅ Server Relay        - All traffic through backend
✅ No WebRTC          - No peer-to-peer connection
✅ No STUN            - No IP discovery
✅ Socket.io Only     - Encrypted transport
✅ No ICE Candidates  - No IP exchange
```

### Data Protection
```
Transport Encryption   - WSS/TLS in production
File Chunking         - 64KB secure chunks
Session Management    - Socket-based sessions
Room Expiration       - Automatic cleanup
```

---

## 📦 Optional/Future Stack

### Blockchain Integration (Available but not required)
```
Solidity              - Smart contracts
Hardhat               - Ethereum development
ethers.js 6.10.0      - Web3 library
MetaMask              - Wallet integration
Polygon/Sepolia       - Blockchain networks
```

### Enhanced Privacy (Future)
```
End-to-End Encryption - File content encryption
Zero-Knowledge Proofs - Anonymous authentication
Multi-Relay Network   - Distributed relay nodes
Tor Integration       - Maximum anonymity
```

---

## 🗂️ Project Structure

### Frontend Structure
```
roomlink-share-direct/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── ConnectionStatus.tsx
│   │   └── BlockchainConnect.tsx
│   ├── hooks/
│   │   ├── useRelayTransfer.ts  # ✅ IP-private transfer
│   │   ├── useWebRTC.ts         # ❌ Deprecated (IP exposure)
│   │   ├── useBlockchain.ts
│   │   └── use-toast.ts
│   ├── pages/
│   │   ├── Index.tsx            # Landing page
│   │   ├── SendRoom.tsx         # Sender interface
│   │   ├── ReceiveRoom.tsx      # Receiver interface
│   │   └── NotFound.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── config/
│   │   └── blockchain.ts
│   ├── utils/
│   │   └── relayRouting.ts
│   ├── socket.js                # Socket.io client
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env                         # Environment config
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   └── socket.js            # Socket.io configuration
│   ├── controllers/
│   │   └── roomController.js    # Room creation
│   ├── routes/
│   │   └── roomRoutes.js        # API routes
│   ├── sockets/
│   │   ├── roomSocket.js        # Legacy WebRTC signaling
│   │   └── relaySocket.js       # ✅ IP-private relay
│   ├── utils/
│   │   └── roomStore.js         # In-memory storage
│   ├── app.js                   # Express app
│   └── server.js                # Server entry point
├── .env
└── package.json
```

---

## 🔄 Data Flow Stack

### Request Flow
```
1. HTTP Request
   └─> Express Router
       └─> Controller
           └─> Room Store
               └─> Response

2. Socket.io Connection
   └─> Socket.io Server
       └─> Relay Handler
           └─> Room Management
               └─> Event Forwarding
```

### File Transfer Flow
```
Sender Browser
  └─> Socket.io Client
      └─> Base64 Encode
          └─> Chunk (64KB)
              └─> Socket.io Server (Relay)
                  └─> Forward to Receiver
                      └─> Socket.io Client
                          └─> Base64 Decode
                              └─> Reconstruct File
                                  └─> Auto Download
```

---

## 📊 Performance Stack

### Optimization
```
Vite                  - Fast HMR & build
React SWC             - Fast React compilation
Code Splitting        - Lazy loading
Tree Shaking          - Remove unused code
Minification          - Production builds
```

### Caching
```
TanStack Query        - Server state caching
Browser Cache         - Static assets
Socket.io             - Connection pooling
```

---

## 🧪 Testing Stack

### Unit Testing
```
Vitest                - Test runner
@testing-library/react - Component testing
@testing-library/jest-dom - DOM assertions
jsdom                 - DOM simulation
```

### E2E Testing (Recommended)
```
Playwright            - Browser automation
Cypress               - E2E testing
```

---

## 🚀 Deployment Stack

### Frontend Deployment
```
Vercel                - Recommended
Netlify               - Alternative
GitHub Pages          - Static hosting
```

### Backend Deployment
```
Render                - Recommended
Heroku                - Alternative
Railway               - Alternative
DigitalOcean          - VPS option
AWS EC2               - Enterprise option
```

### Database (Optional)
```
Currently: In-Memory (JavaScript objects)
Future: 
  ├─ PostgreSQL       - Relational data
  ├─ MongoDB          - Document store
  ├─ Redis            - Caching
  └─ Supabase         - Backend-as-a-Service
```

---

## 🔧 Development Tools

### Package Managers
```
npm                   - Default
yarn                  - Alternative
pnpm                  - Alternative
bun                   - Fast alternative
```

### Version Control
```
Git                   - Source control
GitHub                - Repository hosting
```

### Code Quality
```
ESLint                - Linting
Prettier              - Code formatting
TypeScript            - Type checking
Husky                 - Git hooks (optional)
```

---

## 📈 Monitoring & Analytics (Production)

### Recommended Tools
```
Sentry                - Error tracking
LogRocket             - Session replay
Google Analytics      - Usage analytics
Prometheus            - Metrics
Grafana               - Visualization
```

---

## 🎯 Key Technology Decisions

### Why Socket.io Instead of WebRTC?
```
✅ IP Privacy         - No peer IP exposure
✅ Simpler            - Easier to implement
✅ Reliable           - Better error handling
✅ Firewall Friendly  - Works through proxies
⚠️ Slower            - ~30% slower than P2P
⚠️ Server Load       - Requires server bandwidth
```

### Why React + TypeScript?
```
✅ Type Safety        - Catch errors early
✅ Developer Experience - Better tooling
✅ Maintainability    - Easier to refactor
✅ Community          - Large ecosystem
```

### Why Vite?
```
✅ Fast HMR           - Instant updates
✅ Fast Builds        - Optimized production
✅ Modern             - ES modules native
✅ Plugin Ecosystem   - Extensible
```

### Why Express?
```
✅ Minimal            - Lightweight
✅ Flexible           - Unopinionated
✅ Mature             - Battle-tested
✅ Ecosystem          - Many plugins
```

---

## 📚 Dependencies Summary

### Frontend Dependencies (Key)
```json
{
  "react": "^18.3.1",
  "typescript": "^5.8.3",
  "vite": "^5.4.19",
  "socket.io-client": "^4.8.3",
  "react-router-dom": "^6.30.1",
  "@tanstack/react-query": "^5.83.0",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.462.0",
  "qrcode.react": "^3.2.0",
  "zod": "^3.25.76"
}
```

### Backend Dependencies
```json
{
  "express": "^5.2.1",
  "socket.io": "^4.8.3",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "uuid": "^13.0.0"
}
```

---

## ✅ Tech Stack Summary

### Core Technologies
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + Socket.io
- **Styling:** Tailwind CSS + shadcn/ui
- **Communication:** Socket.io (IP-private relay)
- **Routing:** React Router
- **State:** TanStack Query + React Hooks

### Key Features
- ✅ Complete IP privacy (no WebRTC)
- ✅ Real-time file transfer
- ✅ Modern UI components
- ✅ Type-safe codebase
- ✅ Fast development (Vite)
- ✅ Production ready

### Not Used (Removed for Privacy)
- ❌ WebRTC (IP exposure)
- ❌ STUN servers (IP discovery)
- ❌ TURN servers (not needed)
- ❌ ICE candidates (IP exchange)

---

## 🎉 Conclusion

This tech stack provides:
- **Complete IP privacy** through relay architecture
- **Modern development experience** with React + TypeScript
- **Fast performance** with Vite and optimized builds
- **Beautiful UI** with Tailwind CSS and shadcn/ui
- **Real-time communication** with Socket.io
- **Production ready** with proper error handling

**Your file sharing app is built with modern, privacy-focused technologies!** 🔒✨
