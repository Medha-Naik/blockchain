import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, CONTRACT_ABI } from '@/config/blockchain';
import { toast } from '@/hooks/use-toast';

interface BlockchainState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isLoading: boolean;
}

export function useBlockchain() {
  const [state, setState] = useState<BlockchainState>({
    provider: null,
    signer: null,
    contract: null,
    account: null,
    chainId: null,
    isConnected: false,
    isLoading: false
  });

  // Check if blockchain features are enabled
  const isEnabled = BLOCKCHAIN_CONFIG.features.blockchainEnabled;

  // Initialize Web3 connection
  const connect = useCallback(async () => {
    if (!isEnabled) {
      console.log('Blockchain features disabled');
      return;
    }

    if (!window.ethereum) {
      toast({
        title: 'MetaMask not found',
        description: 'Please install MetaMask to use blockchain features',
        variant: 'destructive'
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Initialize contract
      const contract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.contractAddress,
        CONTRACT_ABI,
        signer
      );

      setState({
        provider,
        signer,
        contract,
        account,
        chainId,
        isConnected: true,
        isLoading: false
      });

      toast({
        title: 'Wallet connected',
        description: `Connected to ${account.slice(0, 6)}...${account.slice(-4)}`
      });

    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Connection failed',
        description: error.message,
        variant: 'destructive'
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [isEnabled]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      provider: null,
      signer: null,
      contract: null,
      account: null,
      chainId: null,
      isConnected: false,
      isLoading: false
    });
    toast({ title: 'Wallet disconnected' });
  }, []);

  // Create room on blockchain
  const createRoom = useCallback(async (roomCode: string, publicKey: string) => {
    if (!state.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const roomHash = ethers.keccak256(ethers.toUtf8Bytes(roomCode));
      const metadata = ethers.toUtf8Bytes(JSON.stringify({ publicKey }));

      const tx = await state.contract.createRoom(roomHash, metadata);
      const receipt = await tx.wait();

      // Extract roomId from event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = state.contract!.interface.parseLog(log);
          return parsed?.name === 'RoomCreated';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = state.contract.interface.parseLog(event);
        const roomId = parsed?.args.roomId;
        return Number(roomId);
      }

      throw new Error('Room creation event not found');
    } catch (error: any) {
      console.error('Failed to create room:', error);
      throw error;
    }
  }, [state.contract]);

  // Join room on blockchain
  const joinRoom = useCallback(async (roomId: number, publicKey: string) => {
    if (!state.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const publicKeyBytes = ethers.toUtf8Bytes(publicKey);
      const tx = await state.contract.joinRoom(roomId, publicKeyBytes);
      await tx.wait();
    } catch (error: any) {
      console.error('Failed to join room:', error);
      throw error;
    }
  }, [state.contract]);

  // Get room information
  const getRoom = useCallback(async (roomId: number) => {
    if (!state.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const room = await state.contract.getRoom(roomId);
      return {
        roomHash: room.roomHash,
        creator: room.creator,
        createdAt: Number(room.createdAt),
        expiresAt: Number(room.expiresAt),
        active: room.active,
        encryptedMetadata: room.encryptedMetadata,
        peerCount: Number(room.peerCount)
      };
    } catch (error: any) {
      console.error('Failed to get room:', error);
      throw error;
    }
  }, [state.contract]);

  // Get room peers
  const getRoomPeers = useCallback(async (roomId: number) => {
    if (!state.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const peers = await state.contract.getRoomPeers(roomId);
      return peers.map((peer: any) => ({
        publicKey: ethers.toUtf8String(peer.publicKey),
        joinedAt: Number(peer.joinedAt),
        active: peer.active
      }));
    } catch (error: any) {
      console.error('Failed to get room peers:', error);
      throw error;
    }
  }, [state.contract]);

  // Get random relay nodes
  const getRelayNodes = useCallback(async (count: number = 3) => {
    if (!state.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const nodes = await state.contract.getRandomRelayNodes(count);
      
      // Get detailed info for each node
      const nodeDetails = await Promise.all(
        nodes.map(async (address: string) => {
          const node = await state.contract!.getRelayNode(address);
          return {
            address: node.nodeAddress,
            endpoint: node.endpoint,
            stake: ethers.formatEther(node.stake),
            reputation: Number(node.reputation),
            active: node.active
          };
        })
      );

      return nodeDetails;
    } catch (error: any) {
      console.error('Failed to get relay nodes:', error);
      throw error;
    }
  }, [state.contract]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== state.account) {
        connect();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [state.account, connect, disconnect]);

  return {
    ...state,
    isEnabled,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    getRoom,
    getRoomPeers,
    getRelayNodes
  };
}
