import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const clients = new Map();
let wss;

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.replace('/?', ''));
    const token = params.get('token');

    const user = verifyToken(token);

    if (!user) {
      ws.close(1008, 'Invalid or missing token');
      return;
    }

    const userId = user.id;
    clients.set(userId, ws);
    console.log(`🔌 WebSocket connected: User ${userId}`);

    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      clients.delete(userId);
      console.log(`❌ WebSocket disconnected: User ${userId}`);
    });
  });

  // Heartbeat interval
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // every 30 seconds
};

export const sendOrderUpdateToUser = (userId, update) => {
  const client = clients.get(userId);
  if (client && client.readyState === client.OPEN) {
    client.send(JSON.stringify(update));
  }
};
