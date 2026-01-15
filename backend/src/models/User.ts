import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  avatar?: string;
  createdAt: Date;
}



const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String , default: "default.webp"},
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IUser>("User", userSchema);