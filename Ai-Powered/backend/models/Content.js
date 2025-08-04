import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prompt: String,
  output: String,
}, { timestamps: true })

export default mongoose.model('Content', contentSchema)
