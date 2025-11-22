import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    enum: ['email', 'twitter', 'facebook', 'instagram', 'chat', 'website']
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: String,
  subject: String,
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['question', 'complaint', 'request', 'feedback', 'other'],
    default: 'question'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'assigned', 'in-progress', 'resolved'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  responseTime: Number, // in minutes
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

querySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Query', querySchema);