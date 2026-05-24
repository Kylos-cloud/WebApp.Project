require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = [
    'https://kylos-cloud.github.io',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:5500',     // VS Code Live Server-ийн default port
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

app.use(cors({
    origin: function (origin, callback) {
        // Origin байхгүй (Postman, curl, server-to-server гэх мэт) → зөвшөөрнө
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Локал орчинд (development-д) бүх localhost/127.0.0.1 ямар ч порт-ыг зөвшөөрнө
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS: Origin not allowed: ' + origin));
    },
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));