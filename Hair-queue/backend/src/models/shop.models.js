// shop.models.js
import mongoose, {Schema} from 'mongoose'

const shopSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String
        },
        phone: String, // Changed from Number to String
        services: [{
            name: String,
            price: Number,
            duration: Number
        }],
        location: { // ADD THIS FIELD
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0]
            }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        averageWaitTime: {
            type: Number,
            default: 15
        }
    },
    {
        timestamps: true
    }
);

// Create geospatial index
shopSchema.index({ location: '2dsphere' });

export default mongoose.model('Shop', shopSchema);