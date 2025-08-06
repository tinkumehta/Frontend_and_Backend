import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  bio: {
    type : String,
    default : "",
  },
  profilePicture: String,
  followers : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
    }
  ],
  following : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
    }
  ]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
