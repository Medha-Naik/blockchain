# 🔗 Blockchain-Enhanced P2P File Sharing Architecture

## 🎯 Problem: IP Address Privacy

**Current Issue:**
- WebRTC requires IP address exchange for P2P connections
- STUN/TURN servers expose peer IP addresses
- Direct P2P reveals network location
- Privacy concerns for sensitive transfers

**Solution:**
Blockchain-based relay network with encrypted routing and anonymous peer discovery.

---

## 🏗️ Proposed Architecture

### High-Level Overview

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Sender    │────────▶│  Blockchain      │◀────────│  Receiver   │
│             │         │  Smart Contract  │         │             │
└─────────────┘         └──────────────────┘         └─────────────┘
       │                         │                           │
       │                         ▼                           │
       │                ┌─────────────────┐                  │
       │                │  Relay Nodes    │                  │
       │                │  (Decentralized)│                  │
       │                └─────────────────┘                  │
       │                         │                           │
       └─────────────────────────┼───────────────────────────┘
                    Encrypted File Transfer
                    (Multi-hop routing)
```

---

## 🔐 Core Components

### 1. Blockchain Layer (Smart Contracts)

**Purpose:** Anonymous peer discovery and session management

**Smart Contract Functions:**

```solidity
// Room Registration
function createRoom(bytes32 roomHash, bytes encryptedMetadata) 
    returns (uint256 roomId)

// Peer Registration (Anonymous)
function joinRoom(uint256 roomId, bytes publicKey, bytes proof) 
    returns (bytes encryptedRelayInfo)

// Relay Node Registration
function registerRelayNode(bytes nodeInfo, uint256 stake) 
    returns (uint256 nodeId)

// Session Verification
function verifySession(uint256 roomId, bytes signature) 
    returns (bool valid)
```

**Key Features:**
- No IP addresses stored on-chain
- Only encrypted metadata and public keys
- Zero-knowledge proofs for authentication
- Relay node reputation system

---

### 2. Relay Network (Decentralized Nodes)

**Purpose:** Multi-hop encrypted routing without exposing IPs

**Relay Node Architecture:**

```
Sender → Relay Node 1 → Relay Node 2 → Relay Node 3 → Receiver
         (Encrypted)     (Re-encrypted)   (Re-encrypted)
```

**How It Works:**
1. Sender encrypts data with receiver's public key
2. Adds multiple layers of encryption (onion routing)
3. Each relay node only knows previous and next hop
4. No single node knows both sender and receiver

**Relay Node Requirements:**
- Stake tokens to become relay node
- Maintain uptime and bandwidth
- Earn rewards for successful transfers
- Slashed for malicious behavior

---

### 3. Anonymous Peer Discovery

**Traditional WebRTC:**
```javascript
// Exposes IP addresses
const offer = await peerConnection.createOffer();
// Contains ICE candidates with IP addresses
```

**Blockchain-Based Discovery:**
```javascript
// Step 1: Generate anonymous identity
const identity = await generateZKIdentity();

// Step 2: Register on blockchain
const roomId = await contract.createRoom(
  keccak256(roomCode),
  encryptPublicKey(metadata)
);

// Step 3: Get relay path from smart contract
const relayPath = await contract.getRelayPath(roomId);

// Step 4: Establish encrypted tunnel
const tunnel = await createEncryptedTunnel(relayPath);
```

---

## 🛠️ Implementation Strategy

### Phase 1: Basic Blockchain Integration

**Tech Stack:**
- **Blockchain:** Ethereum L2 (Polygon, Arbitrum) or Solana
- **Smart Contracts:** Solidity or Rust (Solana)
- **Web3 Library:** ethers.js or web3.js
- **Wallet:** MetaMask integration

**Changes Required:**

1. **Add Web3 Dependencies**
```json
{
  "dependencies": {
    "ethers": "^6.10.0",
    "web3": "^4.5.0",
    "@openzeppelin/contracts": "^5.0.0"
  }
}
```

2. **Smart Contract (Solidity)**
```solidity
// contracts/RoomLink.sol
pragma solidity ^0.8.20;

contract RoomLink {
    struct Room {
        bytes32 roomHash;
        address creator;
        uint256 createdAt;
        bool active;
        bytes encryptedMetadata;
    }
    
    struct Peer {
        bytes publicKey;
        uint256 joinedAt;
        bool verified;
    }
    
    mapping(uint256 => Room) public rooms;
    mapping(uint256 => Peer[]) public roomPeers;
    mapping(address => uint256) public relayNodeStakes;
    
    uint256 public roomCounter;
    uint256 public constant MIN_STAKE = 1 ether;
    
    event RoomCreated(uint256 indexed roomId, bytes32 roomHash);
    event PeerJoined(uint256 indexed roomId, bytes publicKey);
    event RelayNodeRegistered(address indexed node, uint256 stake);
    
    function createRoom(bytes32 _roomHash, bytes memory _metadata) 
        external 
        returns (uint256) 
    {
        roomCounter++;
        rooms[roomCounter] = Room({
            roomHash: _roomHash,
            creator: msg.sender,
            createdAt: block.timestamp,
            active: true,
            encryptedMetadata: _metadata
        });
        
        emit RoomCreated(roomCounter, _roomHash);
        return roomCounter;
    }
    
    function joinRoom(uint256 _roomId, bytes memory _publicKey) 
        external 
    {
        require(rooms[_roomId].active, "Room not active");
        require(roomPeers[_roomId].length < 2, "Room full");
        
        roomPeers[_roomId].push(Peer({
            publicKey: _publicKey,
            joinedAt: block.timestamp,
            verified: true
        }));
        
        emit PeerJoined(_roomId, _publicKey);
    }
    
    function registerRelayNode() external payable {
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        relayNodeStakes[msg.sender] = msg.value;
        emit RelayNodeRegistered(msg.sender, msg.value);
    }
    
    function getRelayNodes() external view returns (address[] memory) {
        // Return list of active relay nodes
        // Implementation depends on node management strategy
    }
}
```

3. **Frontend Integration**
```typescript
// src/hooks/useBlockchain.ts
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const CONTRACT_ADDRESS = '0x...'; // Deploy address
const CONTRACT_ABI = [...]; // Contract ABI

export function useBlockchain() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        setProvider(provider);
        setContract(contract);
        setAccount(await signer.getAddress());
      }
    };
    init();
  }, []);

  const createRoom = async (roomCode: string, metadata: any) => {
    if (!contract) throw new Error('Contract not initialized');
    
    const roomHash = ethers.keccak256(ethers.toUtf8Bytes(roomCode));
    const encryptedMetadata = await encryptMetadata(metadata);
    
    const tx = await contract.createRoom(roomHash, encryptedMetadata);
    const receipt = await tx.wait();
    
    return receipt.logs[0].args.roomId;
  };

  const joinRoom = async (roomId: number, publicKey: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    const tx = await contract.joinRoom(roomId, publicKey);
    await tx.wait();
  };

  return { createRoom, joinRoom, account };
}
```

---

### Phase 2: Relay Network Implementation

**Relay Node Server:**

```javascript
// relay-node/server.js
import express from 'express';
import { WebSocket } from 'ws';
import { ethers } from 'ethers';

class RelayNode {
  constructor(privateKey, contractAddress) {
    this.wallet = new ethers.Wallet(privateKey);
    this.contract = new ethers.Contract(contractAddress, ABI, this.wallet);
    this.connections = new Map();
  }

  async register() {
    // Stake tokens to become relay node
    const tx = await this.contract.registerRelayNode({
      value: ethers.parseEther('1.0')
    });
    await tx.wait();
    console.log('Relay node registered');
  }

  async handleConnection(ws, connectionId) {
    // Store connection without knowing source/destination IPs
    this.connections.set(connectionId, ws);

    ws.on('message', async (encryptedData) => {
      // Decrypt outer layer
      const { nextHop, payload } = await this.decryptLayer(encryptedData);
      
      // Forward to next relay or destination
      await this.forward(nextHop, payload);
    });
  }

  async decryptLayer(encryptedData) {
    // Remove one layer of encryption
    const decrypted = await this.wallet.decrypt(encryptedData);
    return JSON.parse(decrypted);
  }

  async forward(nextHop, payload) {
    // Forward to next relay node
    const nextConnection = this.connections.get(nextHop);
    if (nextConnection) {
      nextConnection.send(payload);
    }
  }
}

const node = new RelayNode(process.env.PRIVATE_KEY, process.env.CONTRACT_ADDRESS);
await node.register();
```

**Multi-Hop Routing:**

```typescript
// src/utils/relayRouting.ts
import { ethers } from 'ethers';

export class RelayRouter {
  async createEncryptedPath(
    data: ArrayBuffer,
    receiverPublicKey: string,
    relayNodes: string[]
  ): Promise<ArrayBuffer> {
    let encrypted = data;

    // Encrypt with receiver's key first
    encrypted = await this.encrypt(encrypted, receiverPublicKey);

    // Add layers for each relay (reverse order)
    for (let i = relayNodes.length - 1; i >= 0; i--) {
      const layer = {
        nextHop: i < relayNodes.length - 1 ? relayNodes[i + 1] : 'destination',
        payload: encrypted
      };
      encrypted = await this.encrypt(
        JSON.stringify(layer),
        relayNodes[i]
      );
    }

    return encrypted;
  }

  async encrypt(data: any, publicKey: string): Promise<ArrayBuffer> {
    // Use ECIES or similar encryption
    const key = await crypto.subtle.importKey(
      'spki',
      this.hexToArrayBuffer(publicKey),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    return await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      typeof data === 'string' ? new TextEncoder().encode(data) : data
    );
  }
}
```

---

### Phase 3: Zero-Knowledge Proofs

**Purpose:** Verify room membership without revealing identity

```typescript
// src/utils/zkProof.ts
import { groth16 } from 'snarkjs';

export class ZKProofSystem {
  async generateProof(roomCode: string, secret: string) {
    // Generate proof that user knows room code without revealing it
    const input = {
      roomCode: this.hash(roomCode),
      secret: secret,
      nullifier: this.hash(secret + roomCode)
    };

    const { proof, publicSignals } = await groth16.fullProve(
      input,
      'circuits/room_membership.wasm',
      'circuits/room_membership.zkey'
    );

    return { proof, publicSignals };
  }

  async verifyProof(proof: any, publicSignals: any): Promise<boolean> {
    const vKey = await fetch('circuits/verification_key.json').then(r => r.json());
    return await groth16.verify(vKey, publicSignals, proof);
  }

  hash(data: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  }
}
```

---

## 🔄 Complete Flow with Blockchain

### 1. Room Creation (Sender)

```typescript
// Sender creates room
const { createRoom } = useBlockchain();
const { generateKeyPair } = useEncryption();

// Generate encryption keys
const { publicKey, privateKey } = await generateKeyPair();

// Create room on blockchain
const roomId = await createRoom(roomCode, {
  publicKey,
  timestamp: Date.now()
});

// Get relay path from smart contract
const relayPath = await contract.getRelayPath(roomId, 3); // 3 hops
```

### 2. Room Joining (Receiver)

```typescript
// Receiver joins room
const { joinRoom } = useBlockchain();
const { generateKeyPair } = useEncryption();

// Generate own keys
const { publicKey, privateKey } = await generateKeyPair();

// Join room on blockchain
await joinRoom(roomId, publicKey);

// Get sender's public key from blockchain
const senderPublicKey = await contract.getRoomPeers(roomId);

// Establish encrypted tunnel through relays
const tunnel = await createRelayTunnel(relayPath);
```

### 3. File Transfer (Through Relays)

```typescript
// Sender encrypts and sends file
const router = new RelayRouter();

// Get relay nodes from blockchain
const relayNodes = await contract.getRelayNodes();
const selectedRelays = selectRandomRelays(relayNodes, 3);

// Encrypt file with multiple layers
const encryptedData = await router.createEncryptedPath(
  fileData,
  receiverPublicKey,
  selectedRelays
);

// Send through first relay
await sendToRelay(selectedRelays[0], encryptedData);
```

---

## 💰 Tokenomics & Incentives

### Token Utility

**$RLINK Token:**
- Stake to become relay node
- Pay for premium features
- Reward relay nodes
- Governance voting

**Relay Node Economics:**
```
Earnings per transfer = Base Fee + (File Size × Rate)
Minimum Stake = 1000 $RLINK
Slash Amount = 10% of stake (for malicious behavior)
```

**User Costs:**
```
Free Tier: Up to 100MB/day (uses free relay nodes)
Premium: Unlimited transfers (0.1 $RLINK per GB)
```

---

## 🔒 Security Considerations

### 1. IP Address Protection
- ✅ Multi-hop routing (3+ relays)
- ✅ No single relay knows both endpoints
- ✅ Encrypted at each layer
- ✅ Random relay selection

### 2. Data Privacy
- ✅ End-to-end encryption
- ✅ Zero-knowledge proofs for authentication
- ✅ No metadata stored on-chain
- ✅ Ephemeral keys per session

### 3. Network Security
- ✅ Relay node reputation system
- ✅ Stake-based security (economic incentive)
- ✅ DDoS protection via rate limiting
- ✅ Sybil attack resistance

---

## 📊 Comparison: Before vs After

| Feature | Current (WebRTC) | With Blockchain |
|---------|------------------|-----------------|
| IP Exposure | ❌ Exposed | ✅ Hidden |
| Centralized Server | ❌ Required | ✅ Decentralized |
| Anonymity | ❌ None | ✅ Full |
| Censorship Resistant | ❌ No | ✅ Yes |
| Cost | ✅ Free | ⚠️ Token fees |
| Speed | ✅ Fast | ⚠️ Slower (multi-hop) |
| Complexity | ✅ Simple | ❌ Complex |

---

## 🚀 Implementation Roadmap

### Phase 1: Smart Contract (2-3 weeks)
- [ ] Deploy room management contract
- [ ] Implement relay node registry
- [ ] Add reputation system
- [ ] Test on testnet

### Phase 2: Relay Network (4-6 weeks)
- [ ] Build relay node software
- [ ] Implement onion routing
- [ ] Deploy 10+ relay nodes
- [ ] Load testing

### Phase 3: Frontend Integration (2-3 weeks)
- [ ] Add MetaMask connection
- [ ] Integrate smart contract calls
- [ ] Update UI for blockchain features
- [ ] Add token payment flow

### Phase 4: ZK Proofs (3-4 weeks)
- [ ] Design ZK circuits
- [ ] Implement proof generation
- [ ] Integrate with smart contracts
- [ ] Security audit

---

## 🛠️ Quick Start (Blockchain Version)

### 1. Install Dependencies
```bash
npm install ethers web3 @openzeppelin/contracts snarkjs
```

### 2. Deploy Smart Contract
```bash
cd contracts
npx hardhat compile
npx hardhat deploy --network polygon
```

### 3. Update Frontend Config
```typescript
// src/config/blockchain.ts
export const BLOCKCHAIN_CONFIG = {
  contractAddress: '0x...',
  network: 'polygon',
  relayNodeCount: 3
};
```

### 4. Run Relay Node
```bash
cd relay-node
npm install
npm start
```

---

## 📚 Additional Resources

- [WebRTC Security](https://webrtc-security.github.io/)
- [Onion Routing](https://www.torproject.org/about/history/)
- [Zero-Knowledge Proofs](https://z.cash/technology/zksnarks/)
- [Ethereum Smart Contracts](https://ethereum.org/en/developers/docs/smart-contracts/)

---

## ⚠️ Trade-offs

**Advantages:**
- Complete IP address privacy
- Decentralized and censorship-resistant
- No single point of failure
- Cryptographically secure

**Disadvantages:**
- Increased latency (multi-hop routing)
- Higher complexity
- Token costs for users
- Requires blockchain infrastructure

---

## 🎯 Conclusion

Adding blockchain enables true anonymous file sharing by:
1. Removing IP address exposure through relay networks
2. Decentralizing the signaling server
3. Adding economic incentives for relay operators
4. Providing cryptographic proof of authenticity

This transforms RoomLink from a simple P2P tool into a privacy-preserving, decentralized file sharing protocol.
