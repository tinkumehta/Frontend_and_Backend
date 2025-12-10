import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
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
    ref: 'User',
    required: true
  },
  service: {
    name: String,
    price: Number,
    duration: Number
  },
  dateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  notes: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  checkInTime: Date,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['app', 'phone', 'admin'],
    default: 'app'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
appointmentSchema.index({ shop: 1, dateTime: 1, status: 1 });
appointmentSchema.index({ barber: 1, dateTime: 1 });
appointmentSchema.index({ customer: 1, createdAt: -1 });

export default mongoose.model('Appointment', appointmentSchema);