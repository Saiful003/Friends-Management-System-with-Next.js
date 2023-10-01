import mongoose, { modelNames } from "mongoose";
const { Schema } = mongoose;

const otpSchema = new Schema({
  otpcode: {
    type: String,
    required: false,
  },
  expiresIn: {
    type: String,
    required: false,
  },
});

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: false },
    isVerifiedUser: { type: Boolean, required: true, default: false },
    resetcode: {
      type: String,
      required: false,
      default: "",
    },
    otp: otpSchema,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
