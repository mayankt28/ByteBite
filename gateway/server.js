import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import setupProxies from './routes/proxyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// For __dirname equivalent with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors({
    origin: true,  
    credentials: true,
}));

app.use('/gateway-api', express.json(), cookieParser(), (req, res) => {
    res.json({ message: 'Gateway internal API' });
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Gateway running' });
});

// Root Route - Serve Documentation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Setup Proxies
setupProxies(app);

// Start Server
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
