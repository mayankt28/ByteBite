import { createProxyMiddleware } from 'http-proxy-middleware';
import authMiddleware from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';

export default function setupProxies(app) {

    // ---- Auth Service ----
    app.use('/api/auth', createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL,
        changeOrigin: true,
    }));

    // ---- Profile Service (Protected) ----
    app.use('/api/profile', authMiddleware, createProxyMiddleware({
        target: process.env.PROFILE_SERVICE_URL,
        changeOrigin: true,
    }));

    // ---- Restaurant Service ----
    
    // Public: Get restaurants, menus, etc.
    app.use('/api/restaurant/public', createProxyMiddleware({
        target: process.env.RESTAURANT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/restaurant/public': '/api/restaurant' },
    }));

    // Admin-only: view pending order, update status etc
    app.use('/api/restaurant/staff/orders', authMiddleware, roleCheck(['admin','manager','employee']), createProxyMiddleware({
        target: process.env.RESTAURANT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/restaurant/staff/orders': '/api/orders' },
    }));

    // Admin-only: view pending order, update status etc
    app.use('/api/restaurant/staff', authMiddleware, roleCheck(['admin','manager','employee']), createProxyMiddleware({
        target: process.env.RESTAURANT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/restaurant/staff': '/api/restaurant' },
    }));

    // Admin-only: Add, update, delete restaurants
    app.use('/api/restaurant/admin', authMiddleware, roleCheck(['admin']), createProxyMiddleware({
        target: process.env.RESTAURANT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/restaurant/admin': '/api/restaurant' },
    }));

    // ---- Review Service ----

    // Public: Get reviews
    app.use('/api/reviews/public', createProxyMiddleware({
        target: process.env.REVIEW_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/reviews/public': '/api/reviews' },
    }));

    // Authenticated Users: Add, delete reviews
    app.use('/api/reviews/user', authMiddleware, createProxyMiddleware({
        target: process.env.REVIEW_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/reviews/user': '/api/reviews' },
    }));

    // ---- Order Service (Protected) ----
    app.use('/api/orders', authMiddleware, createProxyMiddleware({
        target: process.env.ORDER_SERVICE_URL,
        changeOrigin: true,
    }));

    // ---- Analytics Service (Admin or Manager) ----
    app.use('/api/analytics', authMiddleware, roleCheck(['admin', 'manager']), createProxyMiddleware({
        target: process.env.ANALYTICS_SERVICE_URL,
        changeOrigin: true,
    }));
}
