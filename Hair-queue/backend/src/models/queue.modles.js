import mongoose, {Schema} from "mongoose";

const queueSchema = new Schema (
{
    shop : {
        type : Schema.Types.ObjectId,
        ref : "Shop",
        required: true
    },
    customer : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    service : {
        name : String,
        price : Number
    },
    status : {
        type : String,
        enum : ['waiting', 'in_progress', 'completed', 'cancelled'],
        default : 'wating'
    },
    position : {
        type : Number,
        required : tru
    },
    estimatedStartTime : Date,
    createdAt: {
        type : Date,
        default : Date.now()
    }
}, {timestamps : true}
);

export default mongoose.model('Queue', queueSchema)