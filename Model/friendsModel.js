import mongoose from "mongoose";
const { Schema } = mongoose;

const FriendsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    introduceBy: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.models.Friend ||
  mongoose.model("Friend", FriendsSchema);
