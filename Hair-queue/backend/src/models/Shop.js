import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String
  },
  phone: String,
  services: [{
    name: String,
    price: Number,
    duration: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  averageWaitTime: {
    type: Number,
    default: 15
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Shop', shopSchema);