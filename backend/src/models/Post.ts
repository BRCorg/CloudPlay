//------------------ Model Post ------------------//
import { Schema, model, Types, Document } from "mongoose";


export interface IPost extends Document {
  title: string;
  content: string;
  image?: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author: { type: Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model<IPost>("Post", postSchema);