import { WebSocketServer } from 'ws';

const clients = new Map();

let wss;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const userId = new URLSearchParams(req.url.replace('/?', '')).get('userId');

    if (!userId) {
      ws.close(1008, 'Missing userId');
      return;
    }

    clients.set(userId, ws);
    console.log(`WebSocket connected: User ${userId}`);

    ws.on('close', () => {
      clients.delete(userId);
      console.log(`WebSocket disconnected: User ${userId}`);
    });
  });
};

export const sendOrderUpdateToUser = (userId, update) => {
  const client = clients.get(userId);
  console.log(`Update Sent to User: ${userId}`);
  if (client && client.readyState === client.OPEN) {
    client.send(JSON.stringify(update));
  }
};
