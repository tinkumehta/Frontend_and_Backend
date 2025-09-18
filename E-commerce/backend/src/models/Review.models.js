import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating : {
    type : Number,
     required : true,
     min : 1,
     max : 5
  },
  comment : {
    type : String,
    default : false
  },
  isRecommended : {
    type : Boolean,
    default : false
  }
},{
    timestamps : true
});

// prevent user from submitting more than one review per product
reviewSchema.index({user : 1, product : 1}, {unique : true});

export default mongoose.model('Review', reviewSchema);