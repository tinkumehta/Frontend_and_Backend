import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import queueRoutes from './routes/queues.js';
import shopRoutes from './routes/shops.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Socket.io connection handling
const activeConnections = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join shop room for real-time updates
  socket.on('join-shop', (shopId) => {
    socket.join(`shop-${shopId}`);
    console.log(`Socket ${socket.id} joined shop-${shopId}`);
  });

  // Leave shop room
  socket.on('leave-shop', (shopId) => {
    socket.leave(`shop-${shopId}`);
    console.log(`Socket ${socket.id} left shop-${shopId}`);
  });

  // Handle customer joining queue
  socket.on('customer-joined', (data) => {
    const { shopId, customerId, position } = data;
    io.to(`shop-${shopId}`).emit('queue-updated', {
      type: 'customer_joined',
      customerId,
      position,
      timestamp: new Date()
    });
  });

  // Handle barber calling next customer
  socket.on('next-customer', (data) => {
    const { shopId, barberId } = data;
    io.to(`shop-${shopId}`).emit('queue-updated', {
      type: 'next_customer',
      barberId,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Clean up connection tracking
    for (const [key, value] of activeConnections.entries()) {
      if (value === socket.id) {
        activeConnections.delete(key);
      }
    }
  });
});

// Make io accessible to routes
app.set('io', io);

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/queues', queueRoutes);
app.use('/api/v1/shops', shopRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export { io };