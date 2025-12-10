import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide shop name'],
    trim: true,
    maxlength: [100, 'Shop name cannot exceed 100 characters']
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
    country: String,
    zipCode: String
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  phone: String,
  email: String,
  description: String,
  photos: [String],
  openingHours: [{
    day: { type: Number, min: 0, max: 6 }, // 0 = Sunday
    open: String, // "09:00"
    close: String // "20:00"
  }],
  services: [{
    name: String,
    price: Number,
    duration: Number // in minutes
  }],
  barbers: [{
    barber: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
  }],
  averageWaitTime: {
    type: Number,
    default: 15
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowOnlineBooking: { type: Boolean, default: true },
    maxQueueSize: { type: Number, default: 10 },
    advanceBookingDays: { type: Number, default: 7 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location-based queries
shopSchema.index({ location: '2dsphere' });

export default mongoose.model('Shop', shopSchema);