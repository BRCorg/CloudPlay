import { Schema, model } from "mongoose";



const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String , default: "default-avatar.png"},
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = model("User", userSchema);
