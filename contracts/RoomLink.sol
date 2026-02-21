// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RoomLink - Anonymous P2P File Sharing
 * @notice Smart contract for managing rooms without exposing IP addresses
 */
contract RoomLink {
    
    struct Room {
        bytes32 roomHash;
        address creator;
        uint256 createdAt;
        uint256 expiresAt;
        bool active;
        bytes encryptedMetadata;
        uint8 peerCount;
    }
    
    struct Peer {
        bytes publicKey;
        uint256 joinedAt;
        bool active;
    }
    
    struct RelayNode {
        address nodeAddress;
        string endpoint;
        uint256 stake;
        uint256 reputation;
        bool active;
    }
    
    // State variables
    mapping(uint256 => Room) public rooms;
    mapping(uint256 => Peer[]) public roomPeers;
    mapping(address => RelayNode) public relayNodes;
    address[] public activeRelayNodes;
    
    uint256 public roomCounter;
    uint256 public constant MIN_STAKE = 0.1 ether;
    uint256 public constant ROOM_DURATION = 10 minutes;
    uint256 public constant MAX_PEERS = 2;
    
    // Events
    event RoomCreated(uint256 indexed roomId, bytes32 roomHash, uint256 expiresAt);
    event PeerJoined(uint256 indexed roomId, uint256 peerIndex);
    event RoomClosed(uint256 indexed roomId);
    event RelayNodeRegistered(address indexed node, string endpoint);
    event RelayNodeRemoved(address indexed node);
    
    // Modifiers
    modifier roomExists(uint256 _roomId) {
        require(_roomId > 0 && _roomId <= roomCounter, "Room does not exist");
        _;
    }
    
    modifier roomActive(uint256 _roomId) {
        require(rooms[_roomId].active, "Room is not active");
        require(block.timestamp < rooms[_roomId].expiresAt, "Room has expired");
        _;
    }
    
    /**
     * @notice Create a new room for file sharing
     * @param _roomHash Keccak256 hash of the room code
     * @param _metadata Encrypted metadata (public key, etc.)
     * @return roomId The ID of the created room
     */
    function createRoom(bytes32 _roomHash, bytes memory _metadata) 
        external 
        returns (uint256) 
    {
        roomCounter++;
        
        rooms[roomCounter] = Room({
            roomHash: _roomHash,
            creator: msg.sender,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + ROOM_DURATION,
            active: true,
            encryptedMetadata: _metadata,
            peerCount: 0
        });
        
        emit RoomCreated(roomCounter, _roomHash, rooms[roomCounter].expiresAt);
        return roomCounter;
    }
    
    /**
     * @notice Join an existing room
     * @param _roomId The room ID to join
     * @param _publicKey The peer's public key for encryption
     */
    function joinRoom(uint256 _roomId, bytes memory _publicKey) 
        external 
        roomExists(_roomId)
        roomActive(_roomId)
    {
        require(rooms[_roomId].peerCount < MAX_PEERS, "Room is full");
        
        roomPeers[_roomId].push(Peer({
            publicKey: _publicKey,
            joinedAt: block.timestamp,
            active: true
        }));
        
        rooms[_roomId].peerCount++;
        
        emit PeerJoined(_roomId, roomPeers[_roomId].length - 1);
    }
    
    /**
     * @notice Get room information
     * @param _roomId The room ID
     * @return Room struct data
     */
    function getRoom(uint256 _roomId) 
        external 
        view 
        roomExists(_roomId)
        returns (Room memory) 
    {
        return rooms[_roomId];
    }
    
    /**
     * @notice Get all peers in a room
     * @param _roomId The room ID
     * @return Array of peers
     */
    function getRoomPeers(uint256 _roomId) 
        external 
        view 
        roomExists(_roomId)
        returns (Peer[] memory) 
    {
        return roomPeers[_roomId];
    }
    
    /**
     * @notice Close a room (only creator or after expiration)
     * @param _roomId The room ID to close
     */
    function closeRoom(uint256 _roomId) 
        external 
        roomExists(_roomId)
    {
        require(
            msg.sender == rooms[_roomId].creator || 
            block.timestamp >= rooms[_roomId].expiresAt,
            "Not authorized to close room"
        );
        
        rooms[_roomId].active = false;
        emit RoomClosed(_roomId);
    }
    
    /**
     * @notice Register as a relay node
     * @param _endpoint The relay node endpoint (e.g., wss://relay.example.com)
     */
    function registerRelayNode(string memory _endpoint) 
        external 
        payable 
    {
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        require(!relayNodes[msg.sender].active, "Already registered");
        
        relayNodes[msg.sender] = RelayNode({
            nodeAddress: msg.sender,
            endpoint: _endpoint,
            stake: msg.value,
            reputation: 100,
            active: true
        });
        
        activeRelayNodes.push(msg.sender);
        
        emit RelayNodeRegistered(msg.sender, _endpoint);
    }
    
    /**
     * @notice Unregister as a relay node and withdraw stake
     */
    function unregisterRelayNode() external {
        require(relayNodes[msg.sender].active, "Not a registered relay node");
        
        RelayNode memory node = relayNodes[msg.sender];
        relayNodes[msg.sender].active = false;
        
        // Remove from active list
        for (uint i = 0; i < activeRelayNodes.length; i++) {
            if (activeRelayNodes[i] == msg.sender) {
                activeRelayNodes[i] = activeRelayNodes[activeRelayNodes.length - 1];
                activeRelayNodes.pop();
                break;
            }
        }
        
        // Return stake
        payable(msg.sender).transfer(node.stake);
        
        emit RelayNodeRemoved(msg.sender);
    }
    
    /**
     * @notice Get random relay nodes for routing
     * @param _count Number of relay nodes to return
     * @return Array of relay node addresses
     */
    function getRandomRelayNodes(uint256 _count) 
        external 
        view 
        returns (address[] memory) 
    {
        require(_count <= activeRelayNodes.length, "Not enough relay nodes");
        
        address[] memory selected = new address[](_count);
        uint256[] memory indices = new uint256[](_count);
        
        // Simple random selection (not cryptographically secure, use Chainlink VRF in production)
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
        
        for (uint256 i = 0; i < _count; i++) {
            uint256 index = (seed + i) % activeRelayNodes.length;
            
            // Ensure no duplicates
            bool duplicate = false;
            for (uint256 j = 0; j < i; j++) {
                if (indices[j] == index) {
                    duplicate = true;
                    index = (index + 1) % activeRelayNodes.length;
                    j = 0;
                }
            }
            
            indices[i] = index;
            selected[i] = activeRelayNodes[index];
        }
        
        return selected;
    }
    
    /**
     * @notice Get relay node information
     * @param _nodeAddress The relay node address
     * @return RelayNode struct data
     */
    function getRelayNode(address _nodeAddress) 
        external 
        view 
        returns (RelayNode memory) 
    {
        return relayNodes[_nodeAddress];
    }
    
    /**
     * @notice Get count of active relay nodes
     * @return Number of active relay nodes
     */
    function getActiveRelayNodeCount() external view returns (uint256) {
        return activeRelayNodes.length;
    }
}
