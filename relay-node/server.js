import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3001;
const NODE_ID = process.env.NODE_ID || crypto.randomBytes(8).toString('hex');

// Store active connections
const connections = new Map();
const routingTable = new Map();

console.log(`🔗 Relay Node ${NODE_ID} starting...`);

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    nodeId: NODE_ID,
    connections: connections.size,
    uptime: process.uptime()
  });
});

// Node info endpoint
app.get('/info', (_req, res) => {
  res.json({
    nodeId: NODE_ID,
    endpoint: `ws://localhost:${PORT}`,
    activeConnections: connections.size,
    version: '1.0.0'
  });
});

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const connectionId = crypto.randomBytes(16).toString('hex');
  const clientIp = req.socket.remoteAddress;
  
  console.log(`✅ New connection: ${connectionId} (IP hidden for privacy)`);
  
  connections.set(connectionId, {
    ws,
    connectedAt: Date.now(),
    ip: clientIp // Stored but never shared
  });

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    nodeId: NODE_ID,
    connectionId
  }));

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      await handleMessage(connectionId, message, ws);
    } catch (error) {
      console.error('❌ Error handling message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    console.log(`❌ Connection closed: ${connectionId}`);
    connections.delete(connectionId);
    
    // Clean up routing table
    for (const [key, value] of routingTable.entries()) {
      if (value.connectionId === connectionId) {
        routingTable.delete(key);
      }
    }
  });

  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for ${connectionId}:`, error);
  });
});

/**
 * Handle incoming messages
 */
async function handleMessage(_connectionId, message, ws) {
  const { type, payload } = message;

  switch (type) {
    case 'register-route':
      // Register a routing path
      handleRegisterRoute(_connectionId, payload, ws);
      break;

    case 'relay-data':
      // Relay encrypted data to next hop
      await handleRelayData(_connectionId, payload, ws);
      break;

    case 'ping':
      // Respond to ping
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;

    default:
      console.log(`⚠️ Unknown message type: ${type}`);
  }
}

/**
 * Register a routing path
 */
function handleRegisterRoute(connectionId, payload, ws) {
  const { routeId, nextHop } = payload;
  
  routingTable.set(routeId, {
    connectionId,
    nextHop,
    createdAt: Date.now()
  });

  console.log(`📍 Route registered: ${routeId} -> ${nextHop || 'destination'}`);

  ws.send(JSON.stringify({
    type: 'route-registered',
    routeId
  }));
}

/**
 * Relay encrypted data to next hop
 */
async function handleRelayData(_connectionId, payload, ws) {
  const { routeId, encryptedData, nextHop } = payload;

  console.log(`🔄 Relaying data for route: ${routeId}`);

  if (nextHop === 'destination') {
    // This is the final relay, send to destination
    const route = routingTable.get(routeId);
    if (route) {
      const destConnection = connections.get(route.connectionId);
      if (destConnection && destConnection.ws.readyState === 1) {
        destConnection.ws.send(JSON.stringify({
          type: 'data-received',
          routeId,
          data: encryptedData
        }));
        console.log(`✅ Data delivered to destination`);
      }
    }
  } else {
    // Forward to next relay node
    try {
      await forwardToNextRelay(nextHop, {
        routeId,
        encryptedData
      });
      console.log(`✅ Data forwarded to next relay: ${nextHop}`);
    } catch (error) {
      console.error(`❌ Failed to forward data:`, error);
      ws.send(JSON.stringify({
        type: 'relay-error',
        routeId,
        error: 'Failed to forward data'
      }));
    }
  }
}

/**
 * Forward data to next relay node
 */
async function forwardToNextRelay(_nextRelayEndpoint, _data) {
  // In production, this would connect to the next relay node
  // For now, we'll simulate it
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve();
    }, 10);
  });
}

/**
 * Decrypt one layer of onion encryption (not currently used)
 */
function _decryptLayer(encryptedData, privateKey) {
  try {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    return JSON.parse(decrypted.toString());
  } catch (error) {
    console.error('❌ Decryption failed:', error);
    throw error;
  }
}

// Cleanup expired routes periodically
setInterval(() => {
  const now = Date.now();
  const ROUTE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  for (const [routeId, route] of routingTable.entries()) {
    if (now - route.createdAt > ROUTE_TIMEOUT) {
      routingTable.delete(routeId);
      console.log(`🗑️ Expired route removed: ${routeId}`);
    }
  }
}, 60000); // Check every minute

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Relay Node ${NODE_ID} running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
