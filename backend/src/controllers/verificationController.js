import { BlockchainService } from '../services/blockchainService.js';
import { HashService } from '../services/hashService.js';
import { RoomService } from '../services/roomService.js';

/**
 * Verification Controller - Handle file verification requests
 */

export class VerificationController {
  /**
   * Verify file transfer
   * POST /api/verify
   */
  static async verifyTransfer(req, res) {
    try {
      const { roomId, fileName, fileSize, fileType } = req.body;

      if (!roomId || !fileName || !fileSize) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      // Generate file hash from metadata
      const fileHash = HashService.hashMetadata(fileName, fileSize, fileType);

      console.log('🔍 Verifying transfer:', {
        roomId,
        fileName,
        fileSize,
        fileHash
      });

      // Store metadata in room
      RoomService.setFileMetadata(roomId, {
        fileName,
        fileSize,
        fileType,
        fileHash,
        verifiedAt: Date.now()
      });

      // Verify on blockchain if enabled
      const blockchainResult = await BlockchainService.verifyTransfer(
        roomId,
        fileHash,
        fileSize
      );

      res.json({
        success: true,
        message: 'Transfer verified',
        data: {
          roomId,
          fileHash,
          fileSize,
          blockchain: blockchainResult
        }
      });
    } catch (error) {
      console.error('❌ Verification error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get verification status
   * GET /api/verify/:roomId
   */
  static async getVerification(req, res) {
    try {
      const { roomId } = req.params;

      // Get metadata from room
      const metadata = RoomService.getFileMetadata(roomId);

      if (!metadata) {
        return res.status(404).json({
          success: false,
          message: 'No verification found for this room'
        });
      }

      // Get blockchain verification if available
      const blockchainVerification = await BlockchainService.getTransferVerification(roomId);

      res.json({
        success: true,
        data: {
          roomId,
          metadata,
          blockchain: blockchainVerification
        }
      });
    } catch (error) {
      console.error('❌ Get verification error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get blockchain network info
   * GET /api/verify/network
   */
  static async getNetworkInfo(req, res) {
    try {
      const networkInfo = await BlockchainService.getNetworkInfo();

      if (!networkInfo) {
        return res.json({
          success: false,
          message: 'Blockchain not available'
        });
      }

      res.json({
        success: true,
        data: networkInfo
      });
    } catch (error) {
      console.error('❌ Network info error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default VerificationController;
