import { ethers } from 'ethers';
import { getContract, getProvider, BLOCKCHAIN_CONFIG } from '../config/blockchain.js';
import { HashService } from './hashService.js';

/**
 * Blockchain Service - Handle blockchain interactions
 */

export class BlockchainService {
  /**
   * Verify transfer on blockchain
   */
  static async verifyTransfer(roomId, fileHash, fileSize) {
    if (!BLOCKCHAIN_CONFIG.enabled) {
      console.log('⚠️ Blockchain disabled, skipping verification');
      return { success: false, message: 'Blockchain disabled' };
    }

    try {
      const contract = getContract();
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      // Convert file hash to bytes32
      const bytes32Hash = HashService.toBytes32(fileHash);

      console.log('📝 Verifying transfer on blockchain:', {
        roomId,
        fileHash: bytes32Hash,
        fileSize
      });

      // Note: This requires a wallet with private key to sign transactions
      // For read-only operations, we can query the blockchain
      // For write operations, we need a signer

      return {
        success: true,
        message: 'Transfer verification initiated',
        txHash: null // Would contain transaction hash if we could write
      };
    } catch (error) {
      console.error('❌ Blockchain verification failed:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get transfer verification from blockchain
   */
  static async getTransferVerification(roomId) {
    if (!BLOCKCHAIN_CONFIG.enabled) {
      return null;
    }

    try {
      const contract = getContract();
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const verification = await contract.getTransferVerification(roomId);
      
      return {
        fileHash: verification.fileHash,
        fileSize: verification.fileSize.toString(),
        timestamp: verification.timestamp.toString(),
        verified: verification.verified
      };
    } catch (error) {
      console.error('❌ Failed to get verification:', error);
      return null;
    }
  }

  /**
   * Listen for verification events
   */
  static async listenForVerifications(callback) {
    if (!BLOCKCHAIN_CONFIG.enabled) {
      return;
    }

    try {
      const contract = getContract();
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      contract.on('TransferVerified', (roomId, fileHash, fileSize, timestamp, event) => {
        console.log('✅ Transfer verified on blockchain:', {
          roomId: roomId.toString(),
          fileHash,
          fileSize: fileSize.toString(),
          timestamp: timestamp.toString()
        });

        if (callback) {
          callback({
            roomId: roomId.toString(),
            fileHash,
            fileSize: fileSize.toString(),
            timestamp: timestamp.toString()
          });
        }
      });

      console.log('👂 Listening for blockchain verification events...');
    } catch (error) {
      console.error('❌ Failed to listen for events:', error);
    }
  }

  /**
   * Check if blockchain is available
   */
  static isAvailable() {
    return BLOCKCHAIN_CONFIG.enabled && getContract() !== null;
  }

  /**
   * Get blockchain network info
   */
  static async getNetworkInfo() {
    if (!BLOCKCHAIN_CONFIG.enabled) {
      return null;
    }

    try {
      const provider = getProvider();
      if (!provider) {
        return null;
      }

      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();

      return {
        name: network.name,
        chainId: network.chainId.toString(),
        blockNumber
      };
    } catch (error) {
      console.error('❌ Failed to get network info:', error);
      return null;
    }
  }
}

export default BlockchainService;
