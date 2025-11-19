const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const spaRoutes = require('./routes/spaRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',  // Dùng env, linh hoạt cho deploy
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true  // Cho auth cookie nếu cần
}));
app.use(express.json({ limit: '10mb' }));  // Limit payload cho upload images nếu có

// Connect DB (gọi sớm)
connectDB();

// Health check route (dễ test deploy)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
// app.use('/api/spa', spaRoutes);  // Uncomment nếu dùng
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route không tồn tại!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error!' });
});

// Socket logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinAdminRoom', () => {
    socket.join('admin');
    console.log('Admin joined room');
  });

  socket.on('joinUserRoom', (userId) => {
    socket.join(`user_${userId}`);
    console.log('User joined room:', userId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export (trước listen)
module.exports = { app, io, server };

// Start server (di chuyển vào hàm để control nếu cần)
const startServer = (port) => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

const PORT = process.env.PORT || 5000;
startServer(PORT);  // Gọi ở cuối