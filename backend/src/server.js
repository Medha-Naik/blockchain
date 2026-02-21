import http from "http";
import app from "./app.js";
import { initSocket } from "./config/socket.js";
import { initBlockchain } from "./config/blockchain.js";
import { ENV } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { BlockchainService } from "./services/blockchainService.js";

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Initialize Blockchain (if enabled)
if (ENV.BLOCKCHAIN_ENABLED) {
  initBlockchain()
    .then((contract) => {
      if (contract) {
        logger.info('✅ Blockchain initialized successfully');
        
        // Listen for blockchain events
        BlockchainService.listenForVerifications((data) => {
          logger.blockchainVerification(data.roomId, data.fileHash);
        });
      }
    })
    .catch((error) => {
      logger.error('❌ Blockchain initialization failed:', error);
    });
} else {
  logger.info('⚠️ Blockchain features disabled');
}

// Start server
server.listen(ENV.PORT, "0.0.0.0", () => {
  logger.info(`🚀 JustPost server running on port ${ENV.PORT}`);
  logger.info(`📡 Environment: ${ENV.NODE_ENV}`);
  logger.info(`🔒 IP Privacy: Enabled`);
  logger.info(`🔗 Blockchain: ${ENV.BLOCKCHAIN_ENABLED ? 'Enabled' : 'Disabled'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('⚠️ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('⚠️ SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('✅ Server closed');
    process.exit(0);
  });
});
