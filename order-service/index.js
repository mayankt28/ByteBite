import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { connectDB } from './config/db.js';
import { initProducer } from './kafka/producer.js';
import { initConsumer } from './kafka/consumer.js';
import { initWebSocket } from './websocket/socketServer.js';

import { authenticate } from './middleware/auth.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
const server = http.createServer(app);


initWebSocket(server);

await connectDB();
await initProducer();
await initConsumer();

app.use('/api/orders', authenticate, orderRoutes);

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
});
