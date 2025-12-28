import mongoose, {Schema} from 'mongoose'


const serviceSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true } // minutes
  },
  { _id: false }
);


const shopSchema = new Schema (
    {
        name : {
            type : String,
            required : true,
            index : true
        },
        owner: {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        address : {
            street : String,
            city : String,
            state : String,
            country : String
        },
        location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
        phone : Number,
       services: [serviceSchema],
        isActive : {
            type : Boolean,
            default : true
        }, 
            averageWaitTime : {
                type : Number,
                default : 15
            },
           
    },
    {
        timestamps : true
    }
)

// Required for geo queries
shopSchema.index({location : '2dsphere'});

export default mongoose.model('Shop', shopSchema);