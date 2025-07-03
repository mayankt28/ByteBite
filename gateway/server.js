import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import setupProxies from './routes/proxyRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Setup Proxies
setupProxies(app);

// Start Server
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
