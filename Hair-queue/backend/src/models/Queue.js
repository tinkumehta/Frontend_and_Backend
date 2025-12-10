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
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  service: {
    name: String,
    price: Number,
    duration: Number
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'waiting'
  },
  position: {
    type: Number,
    required: true
  },
  estimatedStartTime: Date,
  actualStartTime: Date,
  endTime: Date,
  checkInTime: Date,
  notes: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  transactionId: String,
  source: {
    type: String,
    enum: ['app', 'walk_in', 'admin'],
    default: 'app'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
queueSchema.index({ shop: 1, status: 1, position: 1 });
queueSchema.index({ customer: 1, createdAt: -1 });
queueSchema.index({ barber: 1, status: 1 });

// Virtual for estimated wait time (in minutes)
queueSchema.virtual('estimatedWaitTime').get(function() {
  if (!this.estimatedStartTime) return null;
  const now = new Date();
  return Math.max(0, Math.round((this.estimatedStartTime - now) / (1000 * 60)));
});

export default mongoose.model('Queue', queueSchema);