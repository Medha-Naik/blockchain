/**
 * Simple logger utility
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || 'INFO';
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  error(message, data = null) {
    console.error(this.formatMessage(LOG_LEVELS.ERROR, message, data));
  }

  warn(message, data = null) {
    console.warn(this.formatMessage(LOG_LEVELS.WARN, message, data));
  }

  info(message, data = null) {
    console.log(this.formatMessage(LOG_LEVELS.INFO, message, data));
  }

  debug(message, data = null) {
    if (this.level === 'DEBUG') {
      console.log(this.formatMessage(LOG_LEVELS.DEBUG, message, data));
    }
  }

  // Specific loggers
  roomCreated(roomId) {
    this.info(`Room created: ${roomId}`);
  }

  roomJoined(roomId, socketId, role = null) {
    const roleStr = role ? ` as ${role}` : '';
    this.info(`Socket ${socketId} joined room ${roomId}${roleStr}`);
  }

  roomLeft(roomId, socketId) {
    this.info(`Socket ${socketId} left room ${roomId}`);
  }

  fileTransferStart(roomId, fileName, fileSize) {
    this.info(`File transfer started in room ${roomId}`, { fileName, fileSize });
  }

  fileTransferComplete(roomId, fileName) {
    this.info(`File transfer completed in room ${roomId}`, { fileName });
  }

  blockchainVerification(roomId, fileHash) {
    this.info(`Blockchain verification for room ${roomId}`, { fileHash });
  }

  connectionError(socketId, error) {
    this.error(`Connection error for socket ${socketId}`, { error: error.message });
  }
}

export const logger = new Logger();
export default logger;
