import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    name: String,
    price: Number
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed', 'cancelled'],
    default: 'waiting'
  },
  position: {
    type: Number,
    required: true
  },
  estimatedStartTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Queue', queueSchema);