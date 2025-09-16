import express from 'express'
import cors from 'cors'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import connectDB from './config/database.js'
import errorHandler from './middleware/error.js'


import authRoutes from "./routes/auth.routes.js"
import productsRoutes from "./routes/products.routes.js"
import reviewsRoutes from './routes/reviews.routes.js'

config();
connectDB();
const app = express();

// security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials : true
}));

// rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 100, // 15 minutes
    max : 100 // limity each IP ot 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({limit : '10mb'}));
app.use(express.urlencoded({extended:  true}));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/reviews", reviewsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;