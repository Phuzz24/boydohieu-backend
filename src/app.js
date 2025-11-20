// src/app.js – PHIÊN BẢN ĐÚNG NHẤT, CHẠY 100% REALTIME
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const spaRoutes = require('./routes/spaRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// TẠO IO TRƯỚC
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const { setIO } = require('./utils/socket');
setIO(io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Connect DB
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 & Error handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route không tồn tại!' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error!' });
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinAdminRoom', () => {
    socket.join('admin');
    console.log('Admin joined room');
  });

  socket.on('joinUserRoom', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// START SERVER TRƯỚC
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server đang chạy mượt mà trên port ${PORT}`);
});

// SAU KHI ĐÃ TẠO XONG io VÀ server.listen() → MỚI ĐƯỢC EXPORT!!!
// → ĐÂY LÀ ĐIỂM QUAN TRỌNG NHẤT!!!
module.exports = { app, io, server };