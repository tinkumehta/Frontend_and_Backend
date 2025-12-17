import mongoose, {Schema} from 'mongoose'


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
        phone : String,
        services : [{
            name : String,
            price : Number,
            duration : Number
        }],
        isActive : {
            type : Boolean,
            default : true
        }, 
            averageWaitTime : {
                type : Number,
                default : 15
            },
            createdAt: {
                type : Date,
                default : Date.now
            }
    },
    {
        timestamps : true
    }
)

export default mongoose.model('Shop', shopSchema);