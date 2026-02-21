import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Blockchain configuration
export const BLOCKCHAIN_CONFIG = {
  enabled: process.env.BLOCKCHAIN_ENABLED === 'true',
  network: process.env.BLOCKCHAIN_NETWORK || 'sepolia',
  contractAddress: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  rpcUrl: process.env.RPC_URL || 'https://rpc.sepolia.org',
};

// Initialize provider and contract
let provider = null;
let contract = null;

export const initBlockchain = async () => {
  if (!BLOCKCHAIN_CONFIG.enabled) {
    console.log('⚠️ Blockchain features disabled');
    return null;
  }

  try {
    // Initialize provider
    provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);
    
    // Contract ABI (minimal for verification)
    const contractABI = [
      "function verifyTransfer(uint256 roomId, bytes32 fileHash, uint256 fileSize) external",
      "function getTransferVerification(uint256 roomId) external view returns (bytes32 fileHash, uint256 fileSize, uint256 timestamp, bool verified)",
      "event TransferVerified(uint256 indexed roomId, bytes32 fileHash, uint256 fileSize, uint256 timestamp)"
    ];

    // Initialize contract (read-only for now)
    contract = new ethers.Contract(
      BLOCKCHAIN_CONFIG.contractAddress,
      contractABI,
      provider
    );

    console.log('✅ Blockchain initialized:', BLOCKCHAIN_CONFIG.network);
    return contract;
  } catch (error) {
    console.error('❌ Blockchain initialization failed:', error.message);
    return null;
  }
};

export const getProvider = () => provider;
export const getContract = () => contract;

export default {
  BLOCKCHAIN_CONFIG,
  initBlockchain,
  getProvider,
  getContract
};
