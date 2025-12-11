import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ HEALTH CHECK - This will work!
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ Server is running perfectly!',
    timestamp: new Date().toISOString()
  });
});

// ✅ TEST AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name, email and password'
    });
  }
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { name, email, id: '123' }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password'
    });
  }
  
  res.status(200).json({
    success: true,
    token: 'jwt_token_here_123',
    user: { 
      id: '123', 
      name: 'Test User', 
      email,
      role: 'user'
    }
  });
});

// ✅ TEST SHOP ROUTES
app.get('/api/shops', (req, res) => {
  const shops = [
    {
      id: '1',
      name: 'Modern Cuts Barbershop',
      address: '123 Main St, New York',
      phone: '212-555-1234',
      averageWaitTime: 20,
      services: [
        { name: 'Haircut', price: 25, duration: 30 }
      ]
    },
    {
      id: '2',
      name: 'Classic Barbers',
      address: '456 Oak Ave, Brooklyn',
      phone: '718-555-5678',
      averageWaitTime: 15,
      services: [
        { name: 'Standard Haircut', price: 20, duration: 25 }
      ]
    }
  ];
  
  res.json({
    success: true,
    count: shops.length,
    data: shops
  });
});

app.get('/api/shops/:id', (req, res) => {
  const shopId = req.params.id;
  
  res.json({
    success: true,
    data: {
      id: shopId,
      name: 'Modern Cuts Barbershop',
      address: '123 Main St, New York',
      phone: '212-555-1234',
      services: [
        { name: 'Haircut', price: 25, duration: 30 }
      ]
    }
  });
});

// ✅ TEST QUEUE ROUTES (with mock auth)
const mockAuth = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  // Mock user
  req.user = { id: '123', name: 'Test User' };
  next();
};

app.post('/api/queues/join', mockAuth, (req, res) => {
  const { shopId, service } = req.body;
  
  if (!shopId || !service) {
    return res.status(400).json({
      success: false,
      error: 'Please provide shopId and service'
    });
  }
  
  res.status(201).json({
    success: true,
    message: 'Joined queue successfully',
    data: {
      id: 'queue_123',
      shopId,
      customer: req.user.id,
      service,
      position: 3,
      estimatedWait: 45,
      status: 'waiting'
    }
  });
});

app.get('/api/queues/me', mockAuth, (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'queue_123',
        shop: { id: '1', name: 'Modern Cuts' },
        position: 3,
        estimatedWait: 45,
        status: 'waiting'
      }
    ]
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Test these endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   GET  http://localhost:${PORT}/api/shops`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
});