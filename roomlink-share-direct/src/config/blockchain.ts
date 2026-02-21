export const BLOCKCHAIN_CONFIG = {
  // Contract address (update after deployment)
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // Network configuration
  networks: {
    hardhat: {
      chainId: 31337,
      name: 'Hardhat Local',
      rpcUrl: 'http://127.0.0.1:8545'
    },
    mumbai: {
      chainId: 80001,
      name: 'Polygon Mumbai',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com'
    },
    sepolia: {
      chainId: 11155111,
      name: 'Sepolia Testnet',
      rpcUrl: 'https://rpc.sepolia.org'
    }
  },
  
  // Default network
  defaultNetwork: 'sepolia',
  
  // Relay configuration
  relayNodeCount: 3,
  
  // Feature flags
  features: {
    blockchainEnabled: import.meta.env.VITE_BLOCKCHAIN_ENABLED === 'true',
    relayNetworkEnabled: import.meta.env.VITE_RELAY_ENABLED === 'true'
  }
};

// Contract ABI (minimal for now)
export const CONTRACT_ABI = [
  "function createRoom(bytes32 roomHash, bytes memory metadata) external returns (uint256)",
  "function joinRoom(uint256 roomId, bytes memory publicKey) external",
  "function getRoom(uint256 roomId) external view returns (tuple(bytes32 roomHash, address creator, uint256 createdAt, uint256 expiresAt, bool active, bytes encryptedMetadata, uint8 peerCount))",
  "function getRoomPeers(uint256 roomId) external view returns (tuple(bytes publicKey, uint256 joinedAt, bool active)[])",
  "function getRandomRelayNodes(uint256 count) external view returns (address[])",
  "function getRelayNode(address nodeAddress) external view returns (tuple(address nodeAddress, string endpoint, uint256 stake, uint256 reputation, bool active))",
  "function registerRelayNode(string memory endpoint) external payable",
  "function getActiveRelayNodeCount() external view returns (uint256)",
  "event RoomCreated(uint256 indexed roomId, bytes32 roomHash, uint256 expiresAt)",
  "event PeerJoined(uint256 indexed roomId, uint256 peerIndex)"
];
