import crypto from 'crypto';

/**
 * Hash Service - Generate cryptographic hashes for file verification
 */

export class HashService {
  /**
   * Generate SHA-256 hash of data
   */
  static generateHash(data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  /**
   * Generate hash from file buffer
   */
  static hashFile(buffer) {
    return this.generateHash(buffer);
  }

  /**
   * Generate hash from file metadata
   */
  static hashMetadata(fileName, fileSize, fileType) {
    const metadata = `${fileName}:${fileSize}:${fileType}`;
    return this.generateHash(metadata);
  }

  /**
   * Generate room hash (for blockchain)
   */
  static hashRoom(roomId) {
    return this.generateHash(roomId.toString());
  }

  /**
   * Verify hash matches data
   */
  static verifyHash(data, expectedHash) {
    const actualHash = this.generateHash(data);
    return actualHash === expectedHash;
  }

  /**
   * Generate Ethereum-compatible bytes32 hash
   */
  static toBytes32(data) {
    const hash = this.generateHash(data);
    return '0x' + hash;
  }
}

export default HashService;
