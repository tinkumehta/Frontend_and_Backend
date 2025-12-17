import mongoose, {Schema} from 'mongoose';
import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required : true,
            trim : true
        },
        email : {
            type: String,
            required : true,
            unique : true,
            lowerCase : true,
        },
        password : {
            type: String,
            required : true,
            minlength : 8
        },
        role : {
            type : String,
            enum : ['user', 'barber'],
            default : 'user'
        },
        phone : {
            type : Number,
        },
        createdAt: {
            type : Date,
            default : Date.now()
        }

}, 
{timestamps : true}
)

 userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12)
     next();
 })

 userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
 }

 userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }

 userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
 }


export default mongoose.model('User', userSchema);