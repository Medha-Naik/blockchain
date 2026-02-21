import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' 
    ? ['https://justpost-frontend.onrender.com'] 
    : ['http://localhost:8080', 'http://localhost:3000']),
  
  // File Transfer
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024, // 500MB
  CHUNK_SIZE: parseInt(process.env.CHUNK_SIZE) || 64 * 1024, // 64KB
  MAX_BUFFER_SIZE: parseInt(process.env.MAX_BUFFER_SIZE) || 10 * 1024 * 1024, // 10MB
  
  // Room Settings
  ROOM_EXPIRATION: parseInt(process.env.ROOM_EXPIRATION) || 10 * 60 * 1000, // 10 minutes
  MAX_PEERS_PER_ROOM: parseInt(process.env.MAX_PEERS_PER_ROOM) || 2,
  
  // Blockchain
  BLOCKCHAIN_ENABLED: process.env.BLOCKCHAIN_ENABLED === 'true',
  BLOCKCHAIN_NETWORK: process.env.BLOCKCHAIN_NETWORK || 'sepolia',
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY, // For signing transactions
  
  // Security
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
};

export default ENV;
