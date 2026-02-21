# 🔗 Blockchain Implementation Setup Guide

## Overview

This guide will help you set up the blockchain-enhanced version of RoomLink with anonymous IP routing.

## 📋 Prerequisites

- Node.js v18+
- MetaMask browser extension
- Test ETH/MATIC for deployment (testnet)
- Basic understanding of Web3

---

## 🚀 Quick Start

### Step 1: Install Dependencies

**Smart Contracts:**
```bash
cd contracts
npm install
```

**Relay Node:**
```bash
cd relay-node
npm install
```

**Frontend (already installed):**
```bash
cd roomlink-share-direct
npm install
```

---

### Step 2: Deploy Smart Contract

**Option A: Local Hardhat Network (for testing)**

```bash
cd contracts

# Start local blockchain
npx hardhat node

# In another terminal, deploy
npx hardhat run scripts/deploy.js --network hardhat
```

**Option B: Sepolia Testnet (recommended for demo)**

1. Get Sepolia ETH from faucet: https://sepoliafaucet.com/

2. Create `.env` file in `contracts/`:
```env
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_api_key
```

3. Deploy:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. Copy the contract address from output

---

### Step 3: Configure Frontend

Update `roomlink-share-direct/.env`:

```env
# Enable blockchain features
VITE_BLOCKCHAIN_ENABLED=true
VITE_RELAY_ENABLED=true

# Contract address from deployment
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
```

---

### Step 4: Start Relay Nodes

You need at least 3 relay nodes for anonymous routing.

**Terminal 1 - Relay Node 1:**
```bash
cd relay-node
PORT=3001 NODE_ID=relay-1 npm start
```

**Terminal 2 - Relay Node 2:**
```bash
cd relay-node
PORT=3002 NODE_ID=relay-2 npm start
```

**Terminal 3 - Relay Node 3:**
```bash
cd relay-node
PORT=3003 NODE_ID=relay-3 npm start
```

---

### Step 5: Register Relay Nodes on Blockchain

Each relay node needs to register on the smart contract:

```javascript
// Use Hardhat console or create a script
const contract = await ethers.getContractAt("RoomLink", "CONTRACT_ADDRESS");

// Register each relay node (requires 0.1 ETH stake)
await contract.registerRelayNode("ws://localhost:3001", { 
  value: ethers.parseEther("0.1") 
});

await contract.registerRelayNode("ws://localhost:3002", { 
  value: ethers.parseEther("0.1") 
});

await contract.registerRelayNode("ws://localhost:3003", { 
  value: ethers.parseEther("0.1") 
});
```

Or use this script:

```bash
cd contracts
npx hardhat run scripts/registerRelays.js --network sepolia
```

---

### Step 6: Start Frontend

```bash
cd roomlink-share-direct
npm run dev
```

Visit `http://localhost:5173`

---

## 🔧 How It Works

### Traditional WebRTC (Current)
```
Sender ←→ STUN Server ←→ Receiver
(IP exposed)              (IP exposed)
```

### Blockchain + Relay Network (New)
```
Sender → Relay 1 → Relay 2 → Relay 3 → Receiver
         (Layer 3)  (Layer 2)  (Layer 1)  (Decrypted)
         
• Each relay only knows previous and next hop
• No single relay knows both endpoints
• Files encrypted at each layer (onion routing)
• IP addresses never exposed
```

---

## 📝 Usage Flow

### For Sender:

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection

2. **Create Room**
   - Click "Send Files"
   - Transaction creates room on blockchain
   - Get room code (no IP stored)

3. **Select Files**
   - Drag & drop files
   - Files encrypted with receiver's public key

4. **Transfer**
   - Files routed through 3 random relay nodes
   - Each relay decrypts one layer
   - Receiver gets original file

### For Receiver:

1. **Connect Wallet**
   - Connect MetaMask

2. **Join Room**
   - Enter room code
   - Retrieve sender's public key from blockchain

3. **Receive Files**
   - Files arrive through relay network
   - Automatically decrypted and downloaded

---

## 🔒 Security Features

### IP Privacy
- ✅ Multi-hop routing (3+ relays)
- ✅ Onion encryption (like Tor)
- ✅ No single point knows both endpoints
- ✅ Random relay selection per transfer

### Data Security
- ✅ End-to-end encryption
- ✅ Each relay only decrypts its layer
- ✅ Original data only visible to receiver
- ✅ No data stored on blockchain

### Network Security
- ✅ Relay nodes stake tokens (economic security)
- ✅ Reputation system
- ✅ Slashing for malicious behavior
- ✅ Decentralized (no single point of failure)

---

## 🧪 Testing

### Test Smart Contract

```bash
cd contracts
npx hardhat test
```

### Test Relay Node

```bash
cd relay-node
npm start

# In another terminal
curl http://localhost:3001/health
```

### Test Frontend Integration

1. Enable blockchain features in `.env`
2. Start frontend
3. Connect MetaMask
4. Try creating a room
5. Check browser console for logs

---

## 📊 Monitoring

### Check Relay Node Status

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "healthy",
  "nodeId": "relay-1",
  "connections": 2,
  "uptime": 3600
}
```

### Check Smart Contract

```bash
cd contracts
npx hardhat console --network sepolia

> const contract = await ethers.getContractAt("RoomLink", "CONTRACT_ADDRESS")
> await contract.getActiveRelayNodeCount()
> await contract.roomCounter()
```

---

## 🐛 Troubleshooting

### MetaMask Not Connecting

- Ensure MetaMask is installed
- Check you're on correct network (Sepolia)
- Try refreshing the page

### Contract Deployment Failed

- Check you have enough test ETH
- Verify RPC URL is correct
- Check private key is set in `.env`

### Relay Node Not Starting

- Check port is not in use
- Verify Node.js version (v18+)
- Check `.env` configuration

### Files Not Transferring

- Ensure at least 3 relay nodes are running
- Check relay nodes are registered on blockchain
- Verify blockchain features are enabled
- Check browser console for errors

---

## 💰 Cost Estimation

### Testnet (Free)
- Get test ETH from faucet
- All transactions free
- Perfect for development

### Mainnet (Production)
- Contract deployment: ~$50-100 (one-time)
- Room creation: ~$1-5 per room
- Relay node stake: 0.1 ETH (~$200)
- File transfer: Free (P2P)

### Optimization Tips
- Use Layer 2 (Polygon, Arbitrum) for lower fees
- Batch operations when possible
- Cache relay node list to reduce queries

---

## 🔄 Switching Between Modes

### Traditional Mode (No Blockchain)
```env
VITE_BLOCKCHAIN_ENABLED=false
VITE_RELAY_ENABLED=false
```

### Blockchain Mode (Anonymous)
```env
VITE_BLOCKCHAIN_ENABLED=true
VITE_RELAY_ENABLED=true
VITE_CONTRACT_ADDRESS=0xYourAddress
```

The app will automatically adapt based on these settings.

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Onion Routing Explained](https://www.torproject.org/about/history/)

---

## 🎯 Next Steps

1. ✅ Deploy contract to testnet
2. ✅ Start 3+ relay nodes
3. ✅ Register relay nodes on blockchain
4. ✅ Enable blockchain features in frontend
5. ✅ Test file transfer
6. 🔄 Add more relay nodes for better anonymity
7. 🔄 Implement token economics
8. 🔄 Add zero-knowledge proofs
9. 🔄 Security audit before mainnet

---

## ⚠️ Important Notes

### For Hackathon Demo:
- Use Sepolia testnet (free)
- Run 3 relay nodes locally
- Enable blockchain features
- Show IP privacy in action

### For Production:
- Deploy to mainnet or L2
- Run distributed relay network
- Implement full token economics
- Complete security audit
- Add monitoring and analytics

---

## 🤝 Contributing

To add more features:

1. **Smart Contract**: Edit `contracts/RoomLink.sol`
2. **Relay Node**: Edit `relay-node/server.js`
3. **Frontend**: Edit hooks in `src/hooks/`

Test thoroughly before deploying!

---

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review blockchain architecture doc
- Open GitHub issue
- Check browser console for errors

---

**Ready to go anonymous? Let's build! 🚀**
